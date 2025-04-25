const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Resident Sign-up
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

    // Step 1: Insert the user into the Users table with a placeholder linked_id
    const [userResult] = await db.execute(
      'INSERT INTO Users (email, password, user_type, linked_table, linked_id) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, 'Resident', 'Residents', 0] // Placeholder for linked_id
    );

    const userId = userResult.insertId;

    // Step 2: Insert the resident into the Residents table
    const [residentResult] = await db.execute(
      'INSERT INTO Residents (user_id, full_name, wing, flat_number, flatId, role) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, full_name, wing, flat_number, flatId, role]
    );

    const residentId = residentResult.insertId;

    // Step 3: Update the linked_id in the Users table
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

// Resident Sign-in
exports.residentSignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const [users] = await db.execute('SELECT * FROM Users WHERE email = ? AND user_type = ?', [email, 'Resident']);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const [residents] = await db.execute('SELECT * FROM Residents WHERE user_id = ?', [user.id]);
    const resident = residents[0];

    const token = jwt.sign({ id: user.id, email: user.email, role: user.user_type }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({
      message: 'Login successful',
      resident: { id: resident.id, email: user.email, full_name: resident.full_name, role: resident.role },
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

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    const [existingUsers] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 1: Insert the user into the Users table with a placeholder linked_id
    const [userResult] = await db.execute(
      'INSERT INTO Users (email, password, user_type, linked_table, linked_id) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, 'Admin', 'Admin', 0] // Placeholder for linked_id
    );

    const userId = userResult.insertId;

    // Step 2: Insert the admin into the Admin table
    const [adminResult] = await db.execute(
      'INSERT INTO Admin (user_id, name, contact_info) VALUES (?, ?, ?)',
      [userId, name, contact_info || null]
    );

    const adminId = adminResult.insertId;

    // Step 3: Update the linked_id in the Users table
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

// Admin Sign-in
exports.adminSignin = async (req, res) => {
  try {
    const { email, password } = req.body;

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

    const [admins] = await db.execute('SELECT * FROM Admin WHERE user_id = ?', [user.id]);
    const admin = admins[0];

    const token = jwt.sign({ id: user.id, email: user.email, role: user.user_type }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({
      message: 'Login successful',
      admin: { id: admin.id, email: user.email, name: admin.name },
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

    if (!email || !password || !name || !contact_info) {
      return res.status(400).json({ message: 'Email, password, name, and contact info are required' });
    }

    const [existingUsers] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Guard already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 1: Insert the user into the Users table with a placeholder linked_id
    const [userResult] = await db.execute(
      'INSERT INTO Users (email, password, user_type, linked_table, linked_id) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, 'Guard', 'Guards', 0] // Placeholder for linked_id
    );

    const userId = userResult.insertId;

    // Step 2: Insert the guard into the Guards table
    const [guardResult] = await db.execute(
      'INSERT INTO Guards (user_id, name, contact_info, shift_time) VALUES (?, ?, ?, ?)',
      [userId, name, contact_info, shift_time || null]
    );

    const guardId = guardResult.insertId;

    // Step 3: Update the linked_id in the Users table
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

// Guard Sign-in
exports.guardSignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const [users] = await db.execute('SELECT * FROM Users WHERE email = ? AND user_type = ?', [email, 'Guard']);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const [guards] = await db.execute('SELECT * FROM Guards WHERE user_id = ?', [user.id]);
    const guard = guards[0];

    const token = jwt.sign({ id: user.id, email: user.email, role: user.user_type }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({
      message: 'Login successful',
      guard: { id: guard.id, email: user.email, name: guard.name, contact_info: guard.contact_info, shift_time: guard.shift_time },
      token,
    });
  } catch (error) {
    console.error('Guard Signin Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};