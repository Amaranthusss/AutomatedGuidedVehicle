const express = require('express')
const router = express.Router()


const PagesController = require('../controllers/PagesController');
const ScannerController = require('../controllers/ScannerController');
const TestController = require('../controllers/TestController');

router.get('/', PagesController.home)
router.get('/frontScanner', ScannerController.sendToSite)
router.post('/feedback', ScannerController.get)
router.get('/test', TestController.sendToSite)


module.exports = router