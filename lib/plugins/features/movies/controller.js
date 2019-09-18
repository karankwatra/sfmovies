'use strict';

const Movie = require('../../../models/movie');

exports.create = async (payload) => {
  payload.name = payload.title;
  Reflect.deleteProperty(payload, 'title');

  const movie = await new Movie().save(payload);
  return new Movie({ id: movie.id }).fetch();
};

exports.list = async (query) => {
  return new Movie().query((qb) => {

    // filter exact year
    if (query.year) {
      qb.where('release_year', '=', query.year);
    }

    // filter between 2 years
    if (query.from_year) {
      qb.where('release_year', '>=', query.from_year);
    }

    if (query.to_year) {
      qb.where('release_year', '<=', query.to_year);
    }

    // fuzzy filter by title
    if (query.title) {
      qb.where('name', 'ILIKE', `%${query.title}%`);
    }

  }).fetchAll();
};
