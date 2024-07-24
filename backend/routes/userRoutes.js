const express = require('express');
const {signup , login, allUsers} = require('../controllers/authController');
const {auth} = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/login' , login);
router.post('/signup' , signup);
router.get('/searchUser' , auth ,allUsers);

module.exports = router;