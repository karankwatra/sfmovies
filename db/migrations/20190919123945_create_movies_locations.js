'use strict';

exports.up = async (Knex) => {
  await Knex.schema.createTable('movies_locations', (table) => {
    table.increments('id').primary();
    table.integer('movie_id').references('movies.id');
    table.integer('location_id').references('locations.id');
  });
};

exports.down = async (Knex) => {
  await Knex.schema.dropTable('movies_locations');
};
