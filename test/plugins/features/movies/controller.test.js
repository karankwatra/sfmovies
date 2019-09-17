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

    beforeEach(async () => {
      await Knex.raw('DELETE FROM movies;');

      this.payload = { title: 'Zodiac', release_year: 2007 };
      this.payload2 = { title: 'Dawn of the Planet of the Apes', release_year: 2014 };

      await Controller.create(this.payload);
      await Controller.create(this.payload2);
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
      expect(movies.models[0].get('title')).to.eql(this.payload.title);
      expect(movies.models[0].get('release_year')).to.eql(this.payload.release_year);
    });

    it('retrieves movies in a range of years', async () => {
      const query = { from_year: 2000, to_year: 2010 };
      const movies = await Controller.list(query);

      expect(movies.length).to.eql(1);
      expect(movies.models[0].get('title')).to.eql(this.payload.title);
      expect(movies.models[0].get('release_year')).to.eql(this.payload.release_year);
    });

    it('retrieves a movie based on the title', async () => {
      const query = { title: 'Zodiac' };
      const movies = await Controller.list(query);

      expect(movies.length).to.eql(1);
      expect(movies.models[0].get('title')).to.eql(this.payload.title);
      expect(movies.models[0].get('release_year')).to.eql(this.payload.release_year);
    });

    it('retrieves a movie based on the fuzzy title', async () => {
      const query = { title: 'apes' };
      const movies = await Controller.list(query);

      expect(movies.length).to.eql(1);
      expect(movies.models[0].get('title')).to.eql(this.payload2.title);
      expect(movies.models[0].get('release_year')).to.eql(this.payload2.release_year);
    });

  });

});
