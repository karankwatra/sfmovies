'use strict';

const Factory = require('rosie').Factory;

module.exports = Factory.define('locations_movies')
.sequence('id')
.attr('movie_id', 'movie_id')
.attr('location_id', 'location_id');
