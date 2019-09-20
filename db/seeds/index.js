'use strict';

const Movies    = require('./data/movies');
const Locations = require('./data/locations');

exports.seed = async (Knex) => {
  await Knex.raw('TRUNCATE movies CASCADE;');
  await Knex('movies').insert(Movies);
  await Knex.raw('TRUNCATE locations CASCADE');
  await Knex('locations').insert(Locations);
};
