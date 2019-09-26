'use strict';

const Boom = require('@hapi/boom');

const Location = require('../../../models/location');
const Movie    = require('../../../models/movie');

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

  }).fetchAll({ withRelated: ['locations'] });
};

exports.addLocationToMovie = async (movie_id, payload) => {
  const movie = await new Movie({ id: movie_id }).fetch({ withRelated: ['locations'], require: true })
  .catch(() => {
    throw Boom.notFound('could not find movie');
  });

  const location = await new Location({ name: payload.locationName }).fetch({ require: true })
  .catch(async () => {
    const newLocation = await new Location({ name: payload.locationName }).save();
    movie.locations().attach(newLocation);
    return new Movie({ id: movie_id }).fetch({ withRelated: ['locations'], require: true });
  });

  const existingLocations = movie.related('locations').models.map((loc) => loc.id);

  if (!existingLocations.includes(location.id)) {
    movie.locations().attach(location);
  }

  return new Movie({ id: movie_id }).fetch({ withRelated: ['locations'], require: true });
};
