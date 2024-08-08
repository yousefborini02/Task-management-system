const express = require('express');
const router = express.Router();
const usercontroller= require('../controllers/usercontroller'); // Adjust the path to where your handlers are located

router.post('/signup',usercontroller.signup );
router.post('/login' ,usercontroller. login);

module.exports = router;
