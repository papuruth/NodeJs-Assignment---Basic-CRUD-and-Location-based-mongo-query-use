const mongoose = require('mongoose')

const applySchema = mongoose.Schema

const applyJobs = new applySchema(
    {
        userDetails: {
            type: Object,
            required: true
        },
        jobDetails: {
            type: Object,
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

exports.appliedJobs = mongoose.model('appliedjobs', applyJobs)