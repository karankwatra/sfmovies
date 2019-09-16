'use strict';

const Controller        = require('./controller');
const MovieValidator    = require('../../../validators/movie');
const MovieGetValidator = require('../../../validators/movieget');

exports.register = (server, options, next) => {

  server.route([
    {
      method: 'POST',
      path: '/movies',
      config: {
        handler: (request, reply) => {
          reply(Controller.create(request.payload));
        },
        validate: {
          payload: MovieValidator
        }
      }
    },

    {
      method: 'GET',
      path: '/movies',
      config: {
        handler: (request, reply) => {
          reply(Controller.read(request.query));
        },
        validate: {
          query: MovieGetValidator
        }
      }
    }

  ]);

  next();

};

exports.register.attributes = {
  name: 'movies'
};
