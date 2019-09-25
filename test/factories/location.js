'use strict';

const Factory = require('rosie').Factory;

module.exports = Factory.define('location')
.sequence('id')
.attr('name', 'Bay Bridge');
