const mongoose = require('mongoose')

const JobsSchema = mongoose.Schema

const jobsData = new JobsSchema({
  company: {
    type: String,
    required: true
  },
  profileType: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  annualSalary: {
    type: String,
    required: true
  },
  location: {
    type: { type: String, required: true },
    coordinates: []
  },
  venue: {
    type: String,
    required: true
  },
  eventDate: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }
},
{
  timestamps: true
})

exports.AddJobs = mongoose.model('jobs', jobsData)
