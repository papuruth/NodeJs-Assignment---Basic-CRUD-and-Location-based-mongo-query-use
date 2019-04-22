const Enum = require('enum')

const appliedstatus = new Enum({ '0': 'New', '1': 'Selected', '2': 'In Progress', '3': 'Rejected' }, { freez: true })
module.exports = appliedstatus
