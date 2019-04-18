const express = require('express')
const router = express.Router()
const controller = require('../controllers/controller')

router.post('/user', controller.addUser)
    .post('/admin', controller.addUser)
    .post('/company', controller.addUser)
    .get('/users', controller.getUsers)
    .put('/updateuser/:id', controller.updateUser)
    .put('/deleteuser/:id', controller.deleteUser)
    .post('/jobs', controller.postJobs)
    .get('/jobs', controller.getJobs)
    .put('/updatejob/:id', controller.updateJobs)
    .post('/deletejob/:id', controller.deleteJobs)
    .post('/apply', controller.applyJobs)
    .get('/appliedjobs', controller.getAppliedJobs)
    .post('/updatejobstatus', controller.updateJobStatus)
router
module.exports = router;