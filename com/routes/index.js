const express = require('express')
const router = express.Router()


const PagesController = require('../controllers/PagesController');
const ScannerController = require('../controllers/ScannerController');

router.get('/', PagesController.home)
router.get('/frontScanner', ScannerController.sendToSite)
router.post('/feedback', ScannerController.get)


module.exports = router