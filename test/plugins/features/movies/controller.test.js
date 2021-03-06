'use strict';

const Knex = require('../../../../lib/libraries/knex');

const Controller = require('../../../../lib/plugins/features/movies/controller');

const LocationFactory      = require('../../../factories/location');
const LocationMovieFactory = require('../../../factories/locations_movies');
const MovieFactory         = require('../../../factories/movie');

const testMovie1 = MovieFactory.build({ name: 'Zodiac', release_year: 2007 });
const testMovie2 = MovieFactory.build({ name: 'Dawn of the Planet of the Apes', release_year: 2014 });
const testMovie3 = MovieFactory.build({ name: 'Ant-Man', release_year: 2015 });

const testLocation = LocationFactory.build();
const testLocMov   = LocationMovieFactory.build({ movie_id: testMovie1.id, location_id: testLocation.id });

describe('movie controller', () => {

  beforeEach(async () => {
    await Knex.raw('TRUNCATE movies CASCADE; TRUNCATE locations CASCADE; TRUNCATE locations_movies CASCADE;');
    await Knex('movies').insert([testMovie1, testMovie2, testMovie3]);
    await Knex('locations').insert(testLocation);
  });

  describe('create', () => {

    it('creates a movie', async () => {
      const payload = { title: 'WALL-E' };
      const movie = await Controller.create(payload);
      expect(movie.get('title')).to.eql(payload.title);
    });

  });

  describe('retrieve', () => {

    beforeEach(async () => {
      await Knex('locations_movies').insert(testLocMov);
    });

    it('retrieves the entire list of movies', async () => {
      const query = {};
      const movies = await Controller.list(query);

      expect(movies.length).to.eql(3);
    });

    it('retrieves movies from a specific year', async () => {
      const query = { year: 2007 };
      const movies = await Controller.list(query);

      expect(movies.length).to.eql(1);
      expect(movies.models[0].get('name')).to.eql(testMovie1.name);
      expect(movies.models[0].get('release_year')).to.eql(testMovie1.release_year);
    });

    it('retrieves movies in a range of years', async () => {
      const query = { from_year: 2000, to_year: 2010 };
      const movies = await Controller.list(query);

      expect(movies.length).to.eql(1);
      expect(movies.models[0].get('name')).to.eql(testMovie1.name);
      expect(movies.models[0].get('release_year')).to.eql(testMovie1.release_year);
    });

    it('retrieves a movie based on the title', async () => {
      const query = { title: 'Zodiac' };
      const movies = await Controller.list(query);

      expect(movies.length).to.eql(1);
      expect(movies.models[0].get('name')).to.eql(testMovie1.name);
      expect(movies.models[0].get('release_year')).to.eql(testMovie1.release_year);
    });

    it('retrieves a movie based on the fuzzy title', async () => {
      const query = { title: 'apes' };
      const movies = await Controller.list(query);

      expect(movies.length).to.eql(1);
      expect(movies.models[0].get('name')).to.eql(testMovie2.name);
      expect(movies.models[0].get('release_year')).to.eql(testMovie2.release_year);
    });

    it('retrieves a movie based on its location', async () => {
      const query = { location: testLocation.name };
      const movies = await Controller.list(query);

      expect(movies.length).to.eql(1);
      expect(movies.models[0].get('name')).to.eql(testMovie1.name);
      expect(movies.models[0].get('release_year')).to.eql(testMovie1.release_year);
      expect(movies.models[0].relations.locations.models[0].get('name')).to.eql(testLocation.name);
    });

  });

  describe('retrieve movies with locations', () => {

    beforeEach(async () => {
      await Knex('locations_movies').insert(testLocMov);
    });

    it('retrieves a movie with the related locations', async () => {
      const query = {};
      const movies = await Controller.list(query);

      expect(movies.length).to.eql(3);
      expect(movies.models[0].get('name')).to.eql(testMovie1.name);
      expect(movies.models[0].relations.locations.models[0].attributes.name).to.eql(testLocation.name);
    });

  });

  describe('add location to movie', () => {

    it('adds a location to a movie', async () => {
      const payload = { locationName: testLocation.name };
      const movie = await Controller.addLocationToMovie(testMovie2.id, payload);

      expect(movie.relations.locations.length).to.eql(1);
      expect(movie.relations.locations.models[0].get('name')).to.eql(payload.locationName);
    });

    it('does not add a location to a movie twice', async () => {
      const payload = { locationName: testLocation.name };

      await Controller.addLocationToMovie(testMovie2.id, payload);

      const movie = await Controller.addLocationToMovie(testMovie2.id, payload);

      expect(movie.relations.locations.length).to.eql(1);
      expect(movie.relations.locations.models[0].get('name')).to.eql(payload.locationName);
    });

    it('adds a new location to a movie', async () => {
      const payload = { locationName: 'San Francisco' };
      const movie = await Controller.addLocationToMovie(testMovie3.id, payload);

      expect(movie.relations.locations.length).to.eql(1);
      expect(movie.relations.locations.models[0].get('name')).to.eql(payload.locationName);
    });

  });

  it('errs when adding a location to a non-existent movie', async () => {
    const payload = { locationName: testLocation.name };

    await Controller.addLocationToMovie(9999, payload)
    .catch((err) => {
      expect(err.output.statusCode).to.eql(404);
    });
  });

});
