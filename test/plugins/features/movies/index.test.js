'use strict';

const Knex = require('../../../../lib/libraries/knex');

const Movies = require('../../../../lib/server');

const LocationFactory = require('../../../factories/location');
const MovieFactory    = require('../../../factories/movie');

const testLocation = LocationFactory.build({ name: 'Bay Bridge' });
const testMovie    = MovieFactory.build({ name: 'Zodiac' });

describe('movies integration', () => {

  beforeEach(async () => {
    await Knex.raw('TRUNCATE movies CASCADE; TRUNCATE locations CASCADE; TRUNCATE locations_movies CASCADE;');
    await Knex('movies').insert(testMovie);
    await Knex('locations').insert(testLocation);
  });

  describe('create', () => {

    it('creates a movie', async () => {
      const response = await Movies.inject({
        url: '/movies',
        method: 'POST',
        payload: { title: 'Volver' }
      });

      expect(response.statusCode).to.eql(200);
      expect(response.result.object).to.eql('movie');

    });

  });

  describe('retrieve', () => {

    it('retrieves a movie', async () => {
      const response = await Movies.inject({
        url: '/movies?title=Zodiac',
        method: 'GET'
      });

      expect(response.statusCode).to.eql(200);
      expect(response.result[0].object).to.eql('movie');
    });

  });

  describe('add location', () => {

    it('adds a location to a movie', async () => {
      const response = await Movies.inject({
        url: `/movies/${testMovie.id}/locations`,
        method: 'POST',
        payload: { location_name: testLocation.name }
      });

      expect(response.statusCode).to.eql(200);
      expect(response.result.object).to.eql('movie');
      expect(response.result.locations.length).to.eql(1);
      expect(response.result.locations.models[0].get('name')).to.eql(testLocation.name);
    });

    it('attempts to add a location to a non-existent movie', async () => {
      const response = await Movies.inject({
        url: '/movies/9999/locations',
        method: 'POST',
        payload: { location_name: testLocation.name }
      });

      expect(response.statusCode).to.eql(404);
    });

  });

});
