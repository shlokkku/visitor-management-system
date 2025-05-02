const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

// Helper function to generate TOTP secret
const generateTOTPSecret = () => {
  return speakeasy.generateSecret({
    name: 'Society Management System'
  });
};

// Helper function to verify TOTP token
const verifyTOTP = (secret, token) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token
  });
};

// Setup MFA for a user
exports.setupMFA = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Verify user exists
    const [users] = await db.execute('SELECT * FROM Users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const secret = generateTOTPSecret();
    
    // Save the secret to the database but don't enable MFA yet
    await db.execute('UPDATE Users SET mfa_secret = ? WHERE id = ?', [secret.base32, userId]);
    
    // Generate QR code
    const otpauthUrl = secret.otpauth_url;
    const qrCodeUrl = await qrcode.toDataURL(otpauthUrl);
    
    res.json({
      message: 'MFA setup initiated',
      secret: secret.base32,
      qrCode: qrCodeUrl
    });
  } catch (error) {
    console.error('MFA Setup Error:', error.message);
    res.status(500).json({ message: 'Error setting up MFA', error: error.message });
  }
};

// Verify MFA token and enable MFA if in setup mode
exports.verifyMFAToken = async (req, res) => {
  try {
    const { token, userId, isSetup } = req.body;
    
    const [users] = await db.execute('SELECT mfa_secret FROM Users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }
    
    const secret = users[0].mfa_secret;
    const isValid = verifyTOTP(secret, token);
    
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid MFA token' });
    }

    // If this is part of setup, enable MFA for the user
    if (isSetup) {
      await db.execute('UPDATE Users SET mfa_enabled = TRUE WHERE id = ?', [userId]);
    }
    
    res.json({ message: 'MFA token verified successfully' });
  } catch (error) {
    console.error('MFA Verification Error:', error.message);
    res.status(500).json({ message: 'Error verifying MFA token', error: error.message });
  }
};


exports.residentSignup = async (req, res) => {
  try {
    const { email, password, full_name, wing, flat_number, role } = req.body;

    if (!email || !password || !full_name || !wing || !flat_number || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!['Owner', 'Tenant', 'Family Member'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Allowed values: Owner, Tenant, Family Member' });
    }

    const flatId = `${wing}-${flat_number}`;

    const [existingResidents] = await db.execute('SELECT * FROM Residents WHERE flatId = ?', [flatId]);
    if (existingResidents.length > 0) {
      return res.status(400).json({ message: 'Resident already exists for this flat' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

   
    const [userResult] = await db.execute(
      'INSERT INTO Users (email, password, user_type, linked_table, linked_id) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, 'Resident', 'Residents', 0] 
    );

    const userId = userResult.insertId;

   
    const [residentResult] = await db.execute(
      'INSERT INTO Residents (user_id, full_name, wing, flat_number, flatId, role) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, full_name, wing, flat_number, flatId, role]
    );

    const residentId = residentResult.insertId;

   
    await db.execute('UPDATE Users SET linked_id = ? WHERE id = ?', [residentId, userId]);

    res.status(201).json({
      message: 'Resident created successfully',
      resident: { id: residentId, email, full_name, wing, flat_number, flatId, role },
    });
  } catch (error) {
    console.error('Resident Signup Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Modified Resident Sign-in
exports.residentSignin = async (req, res) => {
  try {
    const { email, password, mfaToken } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const [users] = await db.execute('SELECT * FROM Users WHERE email = ? AND user_type = ?', [email, 'Resident']);
    if (users.length === 0) {
      console.log("Here 1" );
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("here 2");
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if MFA is enabled
    if (user.mfa_enabled) {
      if (!mfaToken) {
        return res.status(403).json({ 
          message: 'MFA token required',
          requireMFA: true,
          userId: user.id
        });
      }
      
      const isValidToken = verifyTOTP(user.mfa_secret, mfaToken);
      if (!isValidToken) {
        return res.status(400).json({ message: 'Invalid MFA token' });
      }
    }

    const [residents] = await db.execute('SELECT * FROM Residents WHERE user_id = ?', [user.id]);
    const resident = residents[0];

    const token = jwt.sign({ id: user.id, email: user.email, role: user.user_type }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({
      message: 'Login successful',
      resident: { 
        id: resident.id, 
        email: user.email, 
        full_name: resident.full_name, 
        role: resident.role,
        mfaEnabled: user.mfa_enabled 
      },
      token,
    });
  } catch (error) {
    console.error('Resident Signin Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin Sign-Up
exports.adminSignup = async (req, res) => {
  try {
    const { email, password, name, contact_info } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    const [existingUsers] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [userResult] = await db.execute(
      'INSERT INTO Users (email, password, user_type, linked_table, linked_id) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, 'Admin', 'Admin', 0]
    );

    const userId = userResult.insertId;

    const [adminResult] = await db.execute(
      'INSERT INTO Admin (user_id, name, contact_info) VALUES (?, ?, ?)',
      [userId, name, contact_info || null]
    );

    const adminId = adminResult.insertId;

    await db.execute('UPDATE Users SET linked_id = ? WHERE id = ?', [adminId, userId]);

    res.status(201).json({
      message: 'Admin created successfully',
      admin: { id: adminId, email, name, contact_info },
    });
  } catch (error) {
    console.error('Admin Signup Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin Sign-In
exports.adminSignin = async (req, res) => {
  try {
    const { email, password, mfaToken } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const [users] = await db.execute('SELECT * FROM Users WHERE email = ? AND user_type = ?', [email, 'Admin']);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if MFA is enabled
    if (!user.mfa_enabled) {
      // MFA is required but not set up
      return res.status(200).json({
        message: 'MFA setup required',
        requireMFA: true,
        mfaEnabled: false,
        userId: user.id,
        credentialsValid: true
      });
    }

    // If MFA is enabled, verify token
    if (user.mfa_enabled) {
      if (!mfaToken) {
        return res.status(200).json({ 
          message: 'MFA verification required',
          requireMFA: true,
          mfaEnabled: true,
          userId: user.id,
          credentialsValid: true
        });
      }
      
      const isValidToken = verifyTOTP(user.mfa_secret, mfaToken);
      if (!isValidToken) {
        return res.status(400).json({ message: 'Invalid MFA token' });
      }
    }

    const [admins] = await db.execute('SELECT * FROM Admin WHERE user_id = ?', [user.id]);
    const admin = admins[0];

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.user_type.toLowerCase() },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      admin: { 
        id: admin.id, 
        email: user.email, 
        name: admin.name, 
        role: user.user_type.toLowerCase(),
        mfaEnabled: user.mfa_enabled 
      },
      token,
    });
  } catch (error) {
    console.error('Admin Signin Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Guard Sign-up
exports.guardSignup = async (req, res) => {
  try {
    const { email, password, name, contact_info, shift_time } = req.body;

    if (!email || !password || !name || !contact_info) {
      return res.status(400).json({ message: 'Email, password, name, and contact info are required' });
    }

    const [existingUsers] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Guard already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

 
    const [userResult] = await db.execute(
      'INSERT INTO Users (email, password, user_type, linked_table, linked_id) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, 'Guard', 'Guards', 0] 
    );

    const userId = userResult.insertId;


    const [guardResult] = await db.execute(
      'INSERT INTO Guards (user_id, name, contact_info, shift_time) VALUES (?, ?, ?, ?)',
      [userId, name, contact_info, shift_time || null]
    );

    const guardId = guardResult.insertId;

  
    await db.execute('UPDATE Users SET linked_id = ? WHERE id = ?', [guardId, userId]);

    res.status(201).json({
      message: 'Guard created successfully',
      guard: { id: guardId, email, name, contact_info, shift_time },
    });
  } catch (error) {
    console.error('Guard Signup Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.guardSignin = async (req, res) => {
  try {
    const { email, password, mfaToken } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const [users] = await db.execute('SELECT * FROM Users WHERE email = ? AND user_type = ?', [email, 'Guard']);
    if (users.length === 0) {
      console.log("Here 5");
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Here 6");
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if MFA is enabled
    if (user.mfa_enabled) {
      if (!mfaToken) {
        return res.status(403).json({ 
          message: 'MFA token required',
          requireMFA: true,
          userId: user.id
        });
      }
      
      const isValidToken = verifyTOTP(user.mfa_secret, mfaToken);
      if (!isValidToken) {
        return res.status(400).json({ message: 'Invalid MFA token' });
      }
    }

    const [guards] = await db.execute('SELECT * FROM Guards WHERE user_id = ?', [user.id]);
    const guard = guards[0];

    const token = jwt.sign({ id: user.id, email: user.email, role: user.user_type }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({
      message: 'Login successful',
      guard: { 
        id: guard.id, 
        email: user.email, 
        name: guard.name, 
        contact_info: guard.contact_info, 
        shift_time: guard.shift_time,
        mfaEnabled: user.mfa_enabled 
      },
      token,
    });
  } catch (error) {
    console.error('Guard Signin Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};