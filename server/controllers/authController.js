const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // MySQL connection
const Guard = require('../models/Guard.mysql');

// Resident Sign-up
exports.residentSignup = async (req, res) => {
  try {
    const { email, password, full_name, wing, flat_number, role } = req.body;

    console.log('Resident Signup Payload:', req.body);

    // Validate input
    if (!email || !password || !full_name || !wing || !flat_number || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate role
    if (!['Owner', 'Tenant', 'Family Member'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Allowed values: Owner, Tenant, Family Member' });
    }

    // Generate flat_info dynamically
    const flatId = `${wing}-${flat_number}`;

    // Check if resident already exists
    const [existingResidents] = await db.execute(
      'SELECT * FROM Residents WHERE flatId = ?',
      [flatId]
    );

    if (existingResidents.length > 0) {
      return res.status(400).json({ message: 'Resident already exists for this flat' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert resident into database
    const [residentResult] = await db.execute(
      'INSERT INTO Residents (email, password, full_name, wing, flat_number, flatId, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, full_name, wing, flat_number, flatId, role]
    );

    res.status(201).json({
      message: 'Resident created successfully',
      resident: {
        id: residentResult.insertId,
        email,
        full_name,
        wing,
        flat_number,
        flatId: flatId,
        role
      },
    });
  } catch (error) {
    console.error('Resident Signup Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Resident Sign-in
exports.residentSignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Resident Signin Payload:', req.body);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find resident login details
    const [residents] = await db.execute(
      'SELECT * FROM Residents WHERE email = ?',
      [email]
    );

    if (residents.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const resident = residents[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, resident.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token with the correct role
    const token = jwt.sign(
      { id: resident.id, email: resident.email, role: resident.role }, // Use the role directly from the database
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      resident: {
        id: resident.id,
        email: resident.email,
        full_name: resident.full_name,
        role: resident.role, // Return the role from the database
      },
      token,
    });
  } catch (error) {
    console.error('Resident Signin Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin Sign-up
exports.adminSignup = async (req, res) => {
  try {
    const { email, password, name, contact_info } = req.body;

    console.log('Admin Signup Payload:', req.body);

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    // Check if admin already exists
    const [existingAdmins] = await db.execute('SELECT * FROM Admin WHERE email = ?', [email]);

    if (existingAdmins.length > 0) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin into database
    const [adminResult] = await db.execute(
      'INSERT INTO Admin (email, password, name, contact_info) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name, contact_info || null]
    );

    res.status(201).json({
      message: 'Admin created successfully',
      admin: {
        id: adminResult.insertId,
        email,
        name,
        contact_info,
        role: 'admin',
      },
    });
  } catch (error) {
    console.error('Admin Signup Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin Sign-in
exports.adminSignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Admin Signin Payload:', req.body);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find admin
    const [admins] = await db.execute('SELECT * FROM Admin WHERE email = ?', [
      email,
    ]);

    if (admins.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const admin = admins[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: 'admin',
      },
      token,
    });
  } catch (error) {
    console.error('Admin Signin Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Guard Sign-up
exports.guardSignup = async (req, res) => {
  try {
    const { email, password, name, contact_info, shift_time } = req.body;

    console.log('Guard Signup Payload:', req.body);

    // Validate input
    if (!email || !password || !name || !contact_info) {
      return res.status(400).json({ message: 'Email, password, name, and contact info are required' });
    }

    // Check if guard already exists
    const existingGuard = await Guard.findByEmail(email);
    if (existingGuard) {
      return res.status(400).json({ message: 'Guard already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new guard using the Guard model
    const guardId = await Guard.create({
      email,
      password: hashedPassword,
      name,
      contact_info,
      shift_time,
    });

    res.status(201).json({
      message: 'Guard created successfully',
      guard: {
        id: guardId,
        email,
        name,
        contact_info,
        shift_time,
      },
    });
  } catch (error) {
    console.error('Guard Signup Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Guard Sign-in
exports.guardSignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Guard Signin Payload:', req.body);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find guard by email using the Guard model
    const guard = await Guard.findByEmail(email);
    if (!guard) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, guard.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: guard.id, email: guard.email, role: 'Guard' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      guard: {
        id: guard.id,
        email: guard.email,
        name: guard.name,
        contact_info: guard.contact_info,
        shift_time: guard.shift_time,
        role: 'Guard',
      },
      token,
    });
  } catch (error) {
    console.error('Guard Signin Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};