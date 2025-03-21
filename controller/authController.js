const jwt = require('jsonwebtoken');
const User = require('../model/user');
const bcrypt = require('bcryptjs');
require('dotenv').config();
// Register User
// const registerUser = async (req, res) => {
//   const { name, email, password, age, dob, work, mobile } = req.body;

//   try {
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     console.log('Hashed password during registration:', hashedPassword); // Log the hashed password

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       age,
//       dob,
//       work,
//       mobile,
//     });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: '30d',
//     });

//     res.status(201).json({ token });
//   } catch (err) {
//     console.error('Registration error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
const registerUser = async (req, res) => {
  const { name, email, password, age, dob, work, mobile } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Do not hash the password here
    const user = await User.create({
      name,
      email,
      password, // Save the plain text password (it will be hashed by the pre('save') hook)
      age,
      dob,
      work,
      mobile,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(201).json({ token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      console.log('User found:', user.email);
      console.log('Stored hashed password:', user.password);
      console.log('Entered password:', password);

      const isMatch = await user.comparePassword(password.trim());
      console.log('Password match:', isMatch);

      if (isMatch) {
        if (user.isBlocked) {
          return res.status(403).json({ message: 'User is blocked' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: '30d',
        });

        // Return user data and success message along with the token
        return res.status(200).json({
          message: 'Login successful',
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            age: user.age,
            dob: user.dob,
            work: user.work,
            mobile: user.mobile,
            role: user.role,
          },
        });
      }
    }

    res.status(401).json({ message: 'Invalid email or password' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser };