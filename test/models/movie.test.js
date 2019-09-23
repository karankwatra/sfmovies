'use strict';

const Knex = require('../../lib/libraries/knex');

const Location = require('../../lib/models/location');
const Movie    = require('../../lib/models/movie');

describe('movie model', () => {

  describe('serialize', () => {

    const moviePayload = { name: 'Zodiac' };
    const locationPayload = { name: 'Bay Bridge' };

    let movie;
    let location;

    beforeEach(async () => {
      await Knex.raw('TRUNCATE movies CASCADE; TRUNCATE locations CASCADE; TRUNCATE locations_movies CASCADE;');

      movie = await new Movie().save(moviePayload);
      location = await new Location().save(locationPayload);

      await movie.locations().attach(location);
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
      const movieFetch = await new Movie({ id: movie.id }).fetch({ withRelated: ['locations'] });
      const movieSerialized = movieFetch.serialize();

      expect(movieSerialized.title).to.eql(moviePayload.name);
      expect(movieSerialized.locations.length).to.eql(1);
      expect(movieSerialized.locations.models[0].get('name')).to.eql(locationPayload.name);
    });

  });

});
