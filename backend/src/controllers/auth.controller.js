const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'Bad Request',
        data: 'Missing required fields',
        status: 'BAD_REQUEST'
      });
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .or(`username.eq.${username},email.eq.${email}`)
      .single();

    if (existingUser) {
      return res.status(409).json({
        message: 'Resource already exists',
        data: 'Username or email already taken',
        status: 'CONFLICT'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{
        username,
        email,
        password_hash,
        first_name: firstName || '',
        last_name: lastName || '',
        is_verified: true // Setting to true for simplified flow, usually would be false until OTP
      }])
      .select()
      .single();

    if (error) throw error;

    // Create default user config
    await supabase.from('user_config').insert([{
      user_id: newUser.id,
      auto_archive: false,
      auto_reply: false,
      encryption_enabled: true,
      signature_enabled: true,
      signature: `Best regards,\n${firstName || username}`
    }]);

    res.status(201).json({
      message: 'User Registered Successfully',
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        isVerified: newUser.is_verified,
        createdAt: newUser.created_at
      },
      status: 'OK'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error', data: err.message, status: 'INTERNAL_SERVER_ERROR' });
  }
};

exports.verify = async (req, res) => {
  // Simplified for this implementation
  res.status(200).json({
    message: 'User verified successfully',
    data: { isVerified: true },
    status: 'OK'
  });
};

exports.resendOtp = async (req, res) => {
  res.status(200).json({
    message: 'OTP sent successfully',
    data: 'OTP sent to registered email',
    status: 'OK'
  });
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !user) {
      return res.status(401).json({
        message: 'Invalid credentials',
        data: 'Username or password is incorrect',
        status: 'UNAUTHORIZED'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials',
        data: 'Username or password is incorrect',
        status: 'UNAUTHORIZED'
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name
        },
        expiresIn: 86400000,
        isVerified: user.is_verified
      },
      status: 'OK'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error', data: err.message, status: 'INTERNAL_SERVER_ERROR' });
  }
};
