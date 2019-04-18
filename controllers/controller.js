const user = require('../models/user')
const job = require('../models/jobs')
const apply = require('../models/appliedJobs')
const roles = require('../enum/userRoles')
const status = require('../enum/jobeStatus')
const aplliedstatus = require('../enum/appliedStatus')

exports.addUser = function (req, res) {
  const check = !!req.body.content;
  if (check) {
    res.send('Cannot be empty');
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
    var location = [{ 'lat': req.body.lat, 'long': req.body.long }]
    let data = new user.Users(
      {
        name: req.body.name,
        emailId: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        location: location,
        role: role
      }
    )

    data.save()
      .then(data => {
        res.status(201).json({
          title: 'Successful',
          detail: 'Successfully added new user',
        });
      })
      .catch(err => {
        res.status(400).json({
          errors: [
            {
              title: 'Error',
              detail: 'Something went wrong during user creation process.',
              errorMessage: err.message,
            },
          ],
        });
      })
  }
}

exports.postJobs = async function (req, res) {
  try {
    const check = !!req.body.content;
    if (check) {
      res.send('Cannot be empty');
    }

    const { name } = req.body
    const checkIsCompanyOrAdmin = await user.Users.findOne({ name })
    if (checkIsCompanyOrAdmin === null) {
      throw new Error('No company or admin exists with name as '.concat(name))
    }
    if (checkIsCompanyOrAdmin.role === 2) {
      throw new Error('Only Company and Admin can post Jobs')
    }
    var location = {
      "coordinates": [
        {
          "lat": req.body.lat,
          "long": req.body.long
        }
      ],
      "Address": [
        {
          "Line 1": req.body.location
        }
      ]
    }
    const data = new job.addJobs(
      {
        company: req.body.company,
        profileType: req.body.profile,
        designation: req.body.designation,
        annualSalary: req.body.salary,
        jobLocation: location,
        venue: req.body.venue,
        eventDate: req.body.date,
        status: status[0].value
      }
    )
    console.log(data)
    await data.save()
      .then(() => {
        res.json({
          title: 'Successful',
          detail: 'Job posted Successfully',
        });
      })
      .catch((err) => {
        throw new Error(err)
      })
  }
  catch (err) {
    res.status(401).json({
      errors: [
        {
          title: 'Error',
          errorMessage: err.message,
        },
      ],
    });
  }
}

exports.getUsers = function (req, res, next) {
  user.Users.find(function (err, data) {
    if (err) return next(err)
    res.send(data)
  })
}

exports.updateUser = function (req, res) {
  user.Users.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, data) {
    if (err) return next(err);
    res.send('User updated successfully');
  });
};

exports.deleteUser = function (req, res) {
  user.Users.findByIdAndRemove(req.params.id, function (err, data) {
    if (err) return next(err);
    res.send('User deleted successfully');
  });
};


exports.getJobs = function (req, res, next) {
  job.addJobs.find(function (err, data) {
    if (err) return next(err)
    res.send(data)
  })
}

exports.updateJobs = function (req, res) {
  job.addJobs.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, data) {
    if (err) return next(err);
    res.send('User updated successfully');
  });
};

exports.deleteJobs = function (req, res) {
  job.addJobs.findByIdAndRemove(req.params.id, function (err, data) {
    if (err) return next(err);
    res.send('User deleted successfully');
  });
};

exports.applyJobs = async function (req, res) {
  try {
    const { name } = req.body
    const key = Object.keys(req.body)
    const value = Object.values(req.body)
    const checkJobs = await job.addJobs.findOne({ [key[1]]: value[1] })
    console.log(checkJobs)
    const checkUser = await user.Users.findOne({ name });

    if (!checkUser) {
      throw new Error('No user exists with name '.concat(name))
    }

    if (checkJobs === null) {
      throw new Error('No jobs found with specified parameters')
    }

    var lat1 = checkUser.location[0].lat
    var lat2 = checkJobs.jobLocation.coordinates[0].lat
    var lon1 = checkUser.location[0].long
    var lon2 = checkJobs.jobLocation.coordinates[0].long
    var distance = CalcDistanceBetween(lat1, lon1, lat2, lon2)
    function CalcDistanceBetween(lat1, lon1, lat2, lon2) {
      var R = 6371e3; // Radius of earth in Meters
      var dLat = toRad(lat2 - lat1);
      var dLon = toRad(lon2 - lon1);
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d / 1000;
    }

    function toRad(Value) {
      /* Converts numeric degrees to radians */
      return Value * Math.PI / 180;
    }

    if (distance > 5) {
      throw new Error('You must be within 5km in range')
    }

    if (checkJobs.status !== 'New') {
      throw new Error('Early bird catches the worm :)')
    }
    const applyData = new apply.appliedJobs({
      userDetails: {
        "location": [
          {
            "lat": checkUser.location[0].lat,
            "long": checkUser.location[0].long
          }
        ],
        "userId": checkUser._id,
        "name": checkUser.name,
        "emailId": checkUser.emailId,
        "phone": checkUser.phone,
        "role": checkUser.role,
      },
      jobDetails: {
        "company": checkJobs.company,
        "profileType": checkJobs.profileType,
        "designation": checkJobs.designation,
        "annualSalary": checkJobs.annualSalary,
        "jobLocation": {
          "coordinates": [
            {
              "lat": checkJobs.jobLocation.coordinates[0].lat,
              "long": checkJobs.jobLocation.coordinates[0].long
            }
          ],
          "Address": [
            {
              "Line 1": checkJobs.jobLocation.Address[0]['Line 1']
            }
          ]
        },
        "venue": checkJobs.venue,
        "eventDate": checkJobs.eventDate,
        "status": checkJobs.status,
        "createdAt": checkJobs.createdAt,
        "updatedAt": checkJobs.updatedAt
      },
      status: aplliedstatus[0].value
    })
    console.log(applyData.status)
    applyData.save()
      .then(() => {
        res.json({
          title: 'Successful',
          detail: 'Job Applied Successfully',
        });
      })
      .catch((err) => {
        throw new Error('Problem in applying job')
      })

  }
  catch (err) {
    res.status(401).json({
      errors: [
        {
          title: 'Error',
          errorMessage: err.message,
        },
      ],
    });
  }
}

// Company can get details of the job applied for his company
// Pass object company: 'company_name'
// Eg. company: "Kellton Tech"
exports.getAppliedJobs = async function (req, res, next) {
  const { company } = req.body
  apply.appliedJobs.find({ 'jobDetails.company': company }, (err, data) => {
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
//Pass company name and status eg.
// 0 for New, 1 for Selected, 2 for Rejected and 3 for Progress
exports.updateJobStatus = async function (req, res, next) {
  const { company, status, name } = req.body
  const jobsList = await apply.appliedJobs.find({ 'jobDetails.company': company }, (err, data) => {
    if (err) {
      return next(err)
    }
  })

  const jobFilter = jobsList.filter((item) => {
    try {
      if (item.userDetails.name === name && item.status !== 'Rejected') {
        return item
      }
    }
    catch (err) {
      console.log(err)
    }
  })
  try {
    if(!aplliedstatus[status].value) {
      throw new Error("Status didn't match")
    }
    const stat = aplliedstatus[status].value.toString()
    jobFilter[0].status = stat
    console.log(stat)
    await apply.appliedJobs.updateOne({ '_id': jobFilter[0]._id }, { $set: { 'status': status } }, function (err, data) {
      if (err) {
        return next(err)
      } else {
        res.status(200).json({
          Message: 'Status Updated'
        })
      }
    })
  }
  catch(err) {
    res.status(404).json({
      Error: err.message
    })
  }
}