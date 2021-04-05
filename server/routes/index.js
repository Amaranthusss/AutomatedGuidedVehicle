const express = require('express')
const router = express.Router()

const PagesController = require('../controllers/PagesController')
const ScannerController = require('../controllers/ScannerController')
const TestController = require('../controllers/TestController')
const MovementsController = require('../controllers/MovementsController')

router.get('/', PagesController.home)
router.get('/frontScanner', ScannerController.sendToSite)
router.post('/feedback', ScannerController.get)
router.get('/test', TestController.sendToSite)
router.post('/upCmd', MovementsController.getForwardCmd)
router.post('/downCmd', MovementsController.getBackwardCmd)
router.post('/leftCmd', MovementsController.getLeftCmd)
router.post('/rightCmd', MovementsController.getRightCmd)
router.post('/maxSpeedCmd', MovementsController.getMaxSpeedCmd)


module.exports = router