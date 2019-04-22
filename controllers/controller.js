const user = require('../models/user')
const job = require('../models/jobs')
const apply = require('../models/appliedJobs')
const roles = require('../enum/userRoles')
const status = require('../enum/jobeStatus')
const aplliedstatus = require('../enum/appliedStatus')

exports.addUser = function (req, res) {
  const check = !!req.body.content
  if (check) {
    res.send('Cannot be empty')
  } else {
    var role
    if (req.route.path === '/user') {
      role = roles[2].value
    }
    if (req.route.path === '/admin') {
      role = roles[0].value
    }
    if (req.route.path === '/company') {
      role = roles[1].value
    }
    let data = new user.Users(
      {
        name: req.body.name,
        emailId: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        location: req.body.location,
        role: role
      }
    )

    data.save()
      .then(data => {
        res.status(201).json({
          title: 'Successful',
          detail: 'Successfully added new user'
        })
      })
      .catch(err => {
        res.status(400).json({
          errors: [
            {
              title: 'Error',
              detail: 'Something went wrong during user creation process.',
              errorMessage: err.message
            }
          ]
        })
      })
  }
}

exports.postJobs = async function (req, res) {
  try {
    const check = !!req.body.content
    if (check) {
      res.send('Cannot be empty')
    }

    const { name, designation, company } = req.body
    const checkIsCompanyOrAdmin = await user.Users.findOne({ name })
    const checkDuplicateJobs = await job.AddJobs.findOne({ $and: [{ 'designation': designation }, { 'company': company }] })
    if (checkIsCompanyOrAdmin === null) {
      throw new Error('No company or admin exists with name as '.concat(name))
    }
    if (checkIsCompanyOrAdmin.role === 2) {
      throw new Error('Only Company and Admin can post Jobs')
    }

    if (checkDuplicateJobs.length !== 0) {
      throw new Error('Job already exists. Please add new jobs')
    }
    const data = new job.AddJobs(
      {
        company: req.body.company,
        profileType: req.body.profile,
        designation: req.body.designation,
        annualSalary: req.body.salary,
        location: req.body.location,
        venue: req.body.venue,
        eventDate: req.body.date,
        status: status[0].value
      }
    )
    await data.save()
      .then(() => {
        res.json({
          title: 'Successful',
          detail: 'Job posted Successfully'
        })
      })
      .catch((err) => {
        throw new Error(err)
      })
  } catch (err) {
    res.status(401).json({
      errors: [
        {
          title: 'Error',
          errorMessage: err.message
        }
      ]
    })
  }
}

exports.getUsers = function (req, res, next) {
  user.Users.find(function (err, data) {
    if (err) return next(err)
    res.send(data)
  })
}

exports.updateUser = function (req, res, next) {
  user.Users.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, data) {
    if (err) return next(err)
    res.send('User updated successfully')
  })
}

exports.deleteUser = function (req, res, next) {
  user.Users.findByIdAndRemove(req.params.id, function (err, data) {
    if (err) return next(err)
    res.send('User deleted successfully')
  })
}

exports.getJobs = function (req, res, next) {
  job.AddJobs.find(function (err, data) {
    if (err) return next(err)
    res.send(data)
  })
}

exports.updateJobs = function (req, res, next) {
  job.AddJobs.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, data) {
    if (err) return next(err)
    res.send('Data updated successfully')
  })
}

exports.deleteJobs = function (req, res, next) {
  job.AddJobs.findByIdAndRemove(req.params.id, function (err, data) {
    if (err) return next(err)
    res.send('Jobs deleted successfully')
  })
}

exports.applyJobs = async function (req, res) {
  try {
    if (Object.keys(req.body).length === 0) {
      res.send('Cannot be empty please provide candidate name and designation')
    }

    if (Object.keys(req.body).length !== 2) {
      throw new Error('Name and Job designation required')
    }
    const { name } = req.body
    const { designation } = req.body
    const checkUser = await user.Users.findOne({ name })
    const checkJobs = await job.AddJobs.findOne({ designation })
    const checkDuplicateApply = await apply.AppliedJobs.findOne({ $and: [{ 'userDetails.name': name }, { 'jobDetails.designation': designation }] })
    if (!checkUser) {
      throw new Error('No user exists with name '.concat(name))
    }

    if (checkUser.role !== 2) {
      throw new Error('Sorry, you cannot apply.')
    }
    if (checkJobs === null) {
      throw new Error('No jobs found with specified parameters')
    }

    if (checkDuplicateApply !== null) {
      throw new Error('You have already applied. Please wait, for result!')
    }
    const lat1 = checkUser.location.coordinates[0]
    const lon1 = checkUser.location.coordinates[1]
    const lat2 = checkJobs.location.coordinates[0]
    const lon2 = checkJobs.location.coordinates[1]
    var distance = CalcDistance(lat1, lon1, lat2, lon2)
    console.log(distance)
    if (distance > 5) {
      throw new Error('You must be within 5km in range')
    }

    if (checkJobs.status !== 'New') {
      throw new Error('Early bird catches the worm :)')
    }

    const applyData = new apply.AppliedJobs({
      userDetails: {
        'location': {
          type: 'Point',
          coordinates: [checkUser.location.coordinates[0], checkUser.location.coordinates[1]]
        },
        'userId': checkUser._id,
        'name': checkUser.name,
        'emailId': checkUser.emailId,
        'phone': checkUser.phone,
        'role': checkUser.role
      },
      jobDetails: {
        'company': checkJobs.company,
        'profileType': checkJobs.profileType,
        'designation': checkJobs.designation,
        'annualSalary': checkJobs.annualSalary,
        'location': {
          type: 'Point',
          coordinates: [checkUser.location.coordinates[0], checkUser.location.coordinates[1]]
        },
        'venue': checkJobs.venue,
        'eventDate': checkJobs.eventDate,
        'status': checkJobs.status,
        'createdAt': checkJobs.createdAt,
        'updatedAt': checkJobs.updatedAt
      },
      status: aplliedstatus[0].value
    })
    await applyData.save()
      .then(() => {
        res.json({
          title: 'Successful',
          detail: 'Job Applied Successfully'
        })
      })
      .catch((err) => {
        throw new Error(err)
      })
  } catch (err) {
    res.status(401).json({
      errors: [
        {
          title: 'Error',
          errorMessage: err.message
        }
      ]
    })
  }
  function CalcDistance (lat1, lon1, lat2, lon2) {
    var R = 6371e3 // Radius of earth in Meters
    var dLat = toRad(lat2 - lat1)
    var dLon = toRad(lon2 - lon1)
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    var d = R * c
    return d / 1000
  }

  function toRad (Value) {
    /* Converts numeric degrees to radians */
    return Value * Math.PI / 180
  }
}

// Company can get details of the job applied for his company
// Pass object company: 'company_name'
// Eg. company: "Kellton Tech"
exports.getAppliedJobs = async function (req, res, next) {
  const { company } = req.body
  await apply.AppliedJobs.find({ 'jobDetails.company': company }, (err, data) => {
    if (err) {
      return next(err)
    } else {
      res.status(200).json({
        AppliedJobs: data
      })
    }
  })
}

// Company can change their recieved job application status here
// Jobs will be updated based on their status
// Pass company name, candidate name and status eg.
// 0 for New, 1 for Selected, 2 for Rejected and 3 for Progress
exports.updateJobStatus = async function (req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.send('Cannot be empty please provide company name, candidate name and status')
  }
  const { company, status, name } = req.body
  const jobsList = await apply.AppliedJobs.find({ 'jobDetails.company': company }, (err, data) => {
    if (err) {
      return next(err)
    }
  })

  const jobFilter = jobsList.filter((item) => {
    try {
      if (item.userDetails.name === name && item.status !== 'Rejected') {
        return item
      }
    } catch (err) {
      console.log(err)
    }
  })
  try {
    if (!aplliedstatus[status].value) {
      throw new Error("Status didn't match")
    }

    await apply.AppliedJobs.updateOne({ '_id': jobFilter[0]._id }, { $set: { 'status': aplliedstatus[status].value } }, function (err, data) {
      if (err) {
        return next(err)
      } else {
        res.status(200).json({
          Message: 'Status Updated'
        })
      }
    })
  } catch (err) {
    res.status(404).json({
      Error: err.message
    })
  }
}
