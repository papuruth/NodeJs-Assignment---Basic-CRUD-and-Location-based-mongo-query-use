const Enum = require('enum')

const appliedstatus = new Enum({'0': 'New', '1': 'Selected', '2': 'Rejected', '3': 'Progress'}, { freez: true });
module.exports = appliedstatus