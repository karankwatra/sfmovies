'use strict';

const Knex = require('../../../../lib/libraries/knex');

const Controller = require('../../../../lib/plugins/features/movies/controller');
const Movie      = require('../../../../lib/models/movie');
const Location   = require('../../../../lib/models/location');

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
      await Knex.raw('TRUNCATE movies CASCADE; TRUNCATE locations CASCADE; TRUNCATE locations_movies CASCADE;');
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

  describe('retrive movies with locations', () => {

    const movie_payload = { name: 'Zodiac' };
    const location_payload = { name: 'Bay Bridge' };

    beforeEach(async () => {
      await Knex.raw('TRUNCATE movies CASCADE; TRUNCATE locations CASCADE; TRUNCATE locations_movies CASCADE;');

      const movie = await new Movie().save(movie_payload);
      const location = await new Location().save(location_payload);

      await new Movie({ id: movie.id }).locations().attach(location);
    });

    it('retrives a movie with the related locations', async () => {
      const query = {};
      const movies = await Controller.list(query);

      expect(movies.length).to.eql(1);
      expect(movies.models[0].get('name')).to.eql(movie_payload.name);
      expect(movies.models[0].relations.locations.models[0].attributes.name).to.eql(location_payload.name);
    });

  });

});
