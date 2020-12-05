const express = require('express');
const router = express.Router();

const { auth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { register } = require('../controllers/register');
const { login } = require('../controllers/login');

const {
    getChanels,
    getChanelById,
    editChanel,
    deleteChanel
} = require('../controllers/chanels');

// register
router.post('/register', register);

// login
router.post('/login', login);

// chanels
router.get('/chanels', getChanels);
router.get('/chanel/:id', getChanelById);
router.put('/chanel/:id', auth, upload("edit", ["photo", "thumbnail"]), editChanel);
router.delete('/chanel/:id', auth, deleteChanel);


module.exports = router;