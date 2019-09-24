'use strict';

const Knex = require('../../lib/libraries/knex');

const Movie = require('../../lib/models/movie');

const LocationFactory      = require('../factories/location');
const LocationMovieFactory = require('../factories/locations_movies');
const MovieFactory         = require('../factories/movie');

const testMovie    = MovieFactory.build();
const testLocation = LocationFactory.build();
const testLocMov   = LocationMovieFactory.build({ movie_id: testMovie.id, location_id: testLocation.id });

describe('movie model', () => {

  describe('serialize', () => {

    beforeEach(async () => {
      await Knex.raw('TRUNCATE movies CASCADE; TRUNCATE locations CASCADE; TRUNCATE locations_movies CASCADE;');
      await Knex('movies').insert(testMovie);
      await Knex('locations').insert(testLocation);
      await Knex('locations_movies').insert(testLocMov);
    });

    it('includes all of the necessary fields', async () => {
      const movieFields = await new Movie();
      const movieSerialized = movieFields.serialize();

      expect(movieSerialized).to.have.all.keys([
        'id',
        'title',
        'release_year',
        'locations',
        'object'
      ]);
    });

    it('serializes with location', async () => {
      const movieFetch = await new Movie({ id: testMovie.id }).fetch({ withRelated: ['locations'] });
      const movieSerialized = movieFetch.serialize();

      expect(movieSerialized.title).to.eql(testMovie.name);
      expect(movieSerialized.locations.length).to.eql(1);
      expect(movieSerialized.locations.models[0].get('name')).to.eql(testLocation.name);
    });

  });

});
