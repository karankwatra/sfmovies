'use strict';

const Movie = require('../../../models/movie');

exports.create = async (payload) => {

  payload.name = payload.title;
  Reflect.deleteProperty(payload, 'title');

  const movie = await new Movie().save(payload);
  return new Movie({ id: movie.id }).fetch();
};

exports.read = async (query) => {

  return new Movie().query((qb) => {

    if (query.year) {
      // filter exact year
      qb.where('release_year', '=', query.year);
    } else if (query.from_year && query.to_year) {
      // filter between 2 years
      qb.where('release_year', '>=', query.from_year).andWhere('release_year', '<=', query.to_year);
    } if (query.title) {
      // fuzzy filter by title
      qb.where('name', 'ILIKE', `%${query.title}%`);
    }

  }).fetchAll();

};
