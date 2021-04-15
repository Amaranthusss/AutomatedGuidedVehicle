const express = require('express')
const router = express.Router()

const PagesController = require('../controllers/PagesController')
const ScannerController = require('../controllers/ScannerController')
const DisplayController = require('../controllers/DisplayController')
const MovementsController = require('../controllers/MovementsController')
const AutoDriver = require('../controllers/AutoDriver')

router.get('/', PagesController.home)
router.get('/frontScanner', ScannerController.sendToSite)
router.post('/feedback', ScannerController.get)
router.get('/getFreq', DisplayController.setFreqDisplay)
router.post('/upCmd', MovementsController.getForwardCmd)
router.post('/downCmd', MovementsController.getBackwardCmd)
router.post('/leftCmd', MovementsController.getLeftCmd)
router.post('/rightCmd', MovementsController.getRightCmd)
router.post('/maxSpeedCmd', MovementsController.getMaxSpeedCmd)
router.post('/saveAutoDriver', AutoDriver.savePath)
router.get('/showPathsAutoDriver', AutoDriver.showPathsList)
router.post('/activeAutoDriver', AutoDriver.activePath)
router.post('/dropDataAutoDriver', AutoDriver.dropPathData)


module.exports = router