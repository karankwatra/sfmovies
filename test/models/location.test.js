'use strict';

const Location = require('../../lib/models/location');

describe('location model', () => {

  describe('serialize', () => {

    it('includes all of the necessary fields', async () => {
      const location = await new Location();
      const locationSerialized = location.serialize();

      expect(locationSerialized).to.have.all.keys([
        'id',
        'name',
        'object'
      ]);
    });

  });

});

