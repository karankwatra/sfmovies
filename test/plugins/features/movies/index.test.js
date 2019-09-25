'use strict';

const Knex = require('../../../../lib/libraries/knex');

const Movies = require('../../../../lib/server');

const MovieFactory = require('../../../factories/movie');

const testMovie = MovieFactory.build({ name: 'Zodiac' });

describe('movies integration', () => {

  beforeEach(async () => {
    await Knex.raw('TRUNCATE movies CASCADE; TRUNCATE locations CASCADE; TRUNCATE locations_movies CASCADE;');
    await Knex('movies').insert(testMovie);
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

});
