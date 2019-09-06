'use strict';

const Movies = require('../../../../lib/server');

describe('movies integration', () => {

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

});
