const express = require('express')
const router = express.Router()
const controller = require('../controllers/controller')

router.post('/user', controller.addUser)
router.get('/user', controller.getUsers)
router.put('/updateUser/:id',controller.updateUser)
router.put('/deleteUser/:id',controller.deleteUser)
router.post('/admin', controller.addUser)
router.post('/company', controller.addUser)
router.post('/jobs', controller.postJobs)
// router.post('/apply', controller.applyJobs)
router
module.exports = router;