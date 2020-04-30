const config = require('./config.json');

var env = process.env.NODE_ENV || 'development';

const envconfig = config[env];

Object.keys(envconfig).forEach(key => process.env[key] = envconfig[key]);