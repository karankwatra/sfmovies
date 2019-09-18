'use strict';

const Controller            = require('./controller');
const MoviesListValidator   = require('../../../validators/movies/list');
const MoviesCreateValidator = require('../../../validators/movies/create');

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
          payload: MoviesCreateValidator
        }
      }
    },
    {
      method: 'GET',
      path: '/movies',
      config: {
        handler: (request, reply) => {
          reply(Controller.list(request.query));
        },
        validate: {
          query: MoviesListValidator
        }
      }
    }
  ]);
  next();
};

exports.register.attributes = {
  name: 'movies'
};
