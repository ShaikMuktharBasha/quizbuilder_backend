const User = require('../models/User');

class UserController {
  async signup(req, res) {
    try {
      console.log('Signup attempt:', req.body);
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        console.log('Email already exists');
        return res.status(400).json({ error: 'Email already exists!' });
      }
      const user = await User.create(req.body);
      console.log('User created:', user.username);
      const userResponse = user.toJSON();
      delete userResponse.password;
      res.status(200).json(userResponse);
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      console.log('Login attempt:', req.body.email);
      const user = await User.findOne({ email: req.body.email });
      console.log('User found:', user ? user.username : 'null');
      if (!user || user.password !== req.body.password) {
        console.log('Invalid credentials');
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const userResponse = user.toJSON();
      delete userResponse.password;
      console.log('Login successful for:', user.username);
      res.status(200).json(userResponse);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await User.find();
      const usersResponse = users.map(u => {
        const user = u.toJSON();
        delete user.password;
        return user;
      });
      res.json(usersResponse);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserController();