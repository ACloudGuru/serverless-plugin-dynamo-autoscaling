const md5 = require('md5');

const clean = input => truncate(input.replace(/[^a-z0-9+]+/gi, ''));

const truncate = input => input.length <= 64 ? input : input.substr(0, 32) + md5(input);

const ucfirst = data => data.charAt(0).toUpperCase() + data.slice(1);

module.exports = { clean, truncate, ucfirst };
