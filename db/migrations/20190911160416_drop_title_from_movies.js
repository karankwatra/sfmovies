'use strict';

const CONSTRAINT = 'movies_name_not_null';
const TABLE      = 'movies';

exports.up = async (Knex) => {
  await Knex.schema.table('movies', (table) => {
    table.dropColumn('title');
  });

  await Knex.raw(`ALTER TABLE ${TABLE} ADD CONSTRAINT ${CONSTRAINT} CHECK (name IS NOT NULL) NOT VALID`);
  await Knex.raw(`ALTER TABLE ${TABLE} VALIDATE CONSTRAINT ${CONSTRAINT}`);
};

exports.down = async (Knex) => {
  await Knex.schema.table('movies', (table) => {
    table.text('title');
  });
  await Knex.raw(`ALTER TABLE ${TABLE} DROP CONSTRAINT ${CONSTRAINT}`);
};
