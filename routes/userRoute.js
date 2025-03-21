const express = require('express');
const { protect, admin } = require('../middelware/auth');
const { getUsers, deleteUser, blockUser } = require('../controller/userController');
const router = express.Router();

router.get('/', protect, getUsers);
router.delete('/:id', protect, admin, deleteUser);
router.put('/block/:id', protect, admin, blockUser);

module.exports = router;