'use strict';

const Factory = require('rosie').Factory;

module.exports = Factory.define('movie')
.sequence('id')
.attr('name', 'Zodiac')
.attr('release_year', 2007);
