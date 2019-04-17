const user = require('../models/user')
const job = require('../models/jobs')
const roles = require('../enum/userRoles')
const status = require('../enum/jobeStatus')

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
    console.log(req.route.path)
    console.log(data)
    data.save()
      .then(data => {
        res.send('Data inserted successfully')
      })
      .catch(err => {
        res.send(err)
      })
  }
}

exports.postJobs = function (req, res) {
  const check = !!req.body.content;
  if (check) {
    res.send('Cannot be empty');
  } else {
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
    let data = new job.addJobs(
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
    data.save()
      .then(data => {
        res.send('Data inserted successfully')
      })
      .catch(err => {
        res.send(err)
      })
  }
}

exports.getUsers = function (req, res, next) {
  user.Users.find(function (err, data) {
    if (err) return next(err)
    res.send(data)
  })
}

exports.updateUser = function (req, res) {
  user.Users.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, data) {
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