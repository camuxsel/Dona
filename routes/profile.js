const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profile');

const loginValidations = require('../middleware/loginValidations');
const registerValidations = require('../middleware/registerValidations');
const editProfileValidations = require('../middleware/editProfileValidations');


router.get('/detallePerfil/:id', profileController.profile);

router.get('/login', profileController.login);

router.get('/profile-edit/:id', profileController.profileEdit);

router.get('/register', profileController.register);

router.post('/register', registerValidations, profileController.store);

router.post('/login', loginValidations, profileController.processLogin);

router.post('/logout', profileController.logout);

router.post('/profile-edit/:id', editProfileValidations, profileController.editProcess);

module.exports = router;