// const files = require('../models/files')
// const fs = require('fs')

// exports.fileUpload = function (req, res) {
//   console.log(req)
//   var data = fs.readFileSync(req.files, 'utf8')
//   var base64Data
//   var binaryData
//   base64Data = data.replace(/^data:image\/png;base64,/, '')
//   base64Data += base64Data.replace('+', ' ')
//   binaryData = new Buffer.from(base64Data, 'base64').toString('binary')

//   fs.writeFile('/files/out.png', binaryData, 'binary', function (err) {
//     console.log(err) // writes out file without error, but it's not a valid image
//   })
// }
