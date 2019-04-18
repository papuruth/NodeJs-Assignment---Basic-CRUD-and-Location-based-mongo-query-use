const secrets = {
    dbUri: 'mongodb://localhost:27017/JobPortal'
  };
  
  const getSecret = (key) => secrets[key];
  
  module.exports = { getSecret };