const mongoose = require('mongoose')

const jobsSchema = mongoose.Schema

const jobsData = new jobsSchema({
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
	jobLocation: {
		type: Object,
		required: true
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

exports.addJobs = mongoose.model('jobs', jobsData)