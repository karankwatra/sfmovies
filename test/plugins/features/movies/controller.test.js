'use strict';

const Knex = require('../../../../lib/libraries/knex');

const Controller = require('../../../../lib/plugins/features/movies/controller');

describe('movie controller', () => {

  describe('create', () => {

    it('creates a movie', async () => {
      const payload = { title: 'WALL-E' };
      const movie = await Controller.create(payload);
      expect(movie.get('title')).to.eql(payload.title);
    });

  });

  describe('retrieve', () => {

    const payload = { name: 'Zodiac', release_year: 2007 };
    const payload2 = { name: 'Dawn of the Planet of the Apes', release_year: 2014 };

    beforeEach(async () => {
      await Knex.raw('DELETE FROM movies;');
      await Knex('movies').insert([payload, payload2]);
    });

    it('retrieves the entire list of movies', async () => {
      const query = {};
      const movies = await Controller.list(query);

      expect(movies.length).to.eql(2);
    });

    it('retrieves movies from a specific year', async () => {
      const query = { year: 2007 };
      const movies = await Controller.list(query);

      expect(movies.length).to.eql(1);
      expect(movies.models[0].get('name')).to.eql(payload.name);
      expect(movies.models[0].get('release_year')).to.eql(payload.release_year);
    });

    it('retrieves movies in a range of years', async () => {
      const query = { from_year: 2000, to_year: 2010 };
      const movies = await Controller.list(query);

      expect(movies.length).to.eql(1);
      expect(movies.models[0].get('name')).to.eql(payload.name);
      expect(movies.models[0].get('release_year')).to.eql(payload.release_year);
    });

    it('retrieves a movie based on the title', async () => {
      const query = { title: 'Zodiac' };
      const movies = await Controller.list(query);

      expect(movies.length).to.eql(1);
      expect(movies.models[0].get('name')).to.eql(payload.name);
      expect(movies.models[0].get('release_year')).to.eql(payload.release_year);
    });

    it('retrieves a movie based on the fuzzy title', async () => {
      const query = { title: 'apes' };
      const movies = await Controller.list(query);

      expect(movies.length).to.eql(1);
      expect(movies.models[0].get('name')).to.eql(payload2.name);
      expect(movies.models[0].get('release_year')).to.eql(payload2.release_year);
    });

  });

});
