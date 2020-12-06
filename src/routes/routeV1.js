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

const {
    getVideos,
    getVideoById,
    addVideo,
    editVideo,
    deleteVideo
} = require('../controllers/videos');

// register
router.post('/register', register);

// login
router.post('/login', login);

// chanels
router.get('/chanels', getChanels);
router.get('/chanel/:id', getChanelById);
router.put('/chanel/:id', auth, upload(["photo", "thumbnail"]), editChanel);
router.delete('/chanel/:id', auth, deleteChanel);

// videos
router.get('/videos', getVideos);
router.get('/video/:id', getVideoById);
router.post('/video', auth, upload(["thumbnail", "video"]), addVideo);
router.put('/video/:videoId', auth, upload(["thumbnail", "video"]), editVideo);
router.delete('/video/:videoId', auth, deleteVideo);

module.exports = router;