const Enum = require('enum')

const status = new Enum({'0': 'New', '1': 'Viewed', '2': 'Selected', '3': 'Rejected'}, { freez: true });
module.exports = status