'use strict';

exports.up = async (Knex) => {
  await Knex.schema.createTable('locations', (table) => {
    table.increments('id').primary();
    table.text('name').notNullable();
  });
};

exports.down = async (Knex) => {
  await Knex.schema.dropTable('locations');
};
