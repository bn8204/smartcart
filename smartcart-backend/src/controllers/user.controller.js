const userService = require('../services/user.service');

exports.register = async (req, res) => {
  try {
    await userService.registerUser(req.body);
    res.json({ message: 'SmartCart user registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const token = await userService.loginUser(req.body);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Login failed' });
  }
};