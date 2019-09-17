'use strict';

const Controller         = require('./controller');
const MovieListValidator = require('../../../validators/movies/list');
const MovieValidator     = require('../../../validators/movies/create');

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
          reply(Controller.list(request.query));
        },
        validate: {
          query: MovieListValidator
        }
      }
    }
  ]);
  next();
};

exports.register.attributes = {
  name: 'movies'
};
