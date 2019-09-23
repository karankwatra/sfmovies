'use strict';

const Knex = require('../../lib/libraries/knex');

const Movie    = require('../../lib/models/movie');
const Location = require('../../lib/models/location');

describe('movie model', () => {

  describe('serialize', () => {

    it('includes all of the necessary fields', () => {
      const movie = Movie.forge().serialize();

      expect(movie).to.have.all.keys([
        'id',
        'title',
        'release_year',
        'locations',
        'object'
      ]);
    });

    it('serialzes with location', async () => {
      const movie_payload = { name: 'Zodiac' };
      const location_payload = { name: 'Bay Bridge' };

      await Knex.raw('TRUNCATE movies CASCADE; TRUNCATE locations CASCADE; TRUNCATE locations_movies CASCADE;');

      const movie = await new Movie().save(movie_payload);
      const location = await new Location().save(location_payload);
      const loc = await new Location({ id: location.id }).fetch();

      await new Movie({ id: movie.id }).locations().attach(loc);

      const movie_fetch = await new Movie({ id: movie.id }).fetch({ withRelated: ['locations'] });

      expect(movie_fetch.get('name')).to.eql(movie_payload.name);
      expect(movie_fetch.relations.locations.models[0].attributes.name).to.eql(location_payload.name);
    });

  });

});
