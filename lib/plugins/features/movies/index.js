'use strict';

const Joi = require('joi');

const Controller            = require('./controller');
const MoviesCreateValidator = require('../../../validators/movies/create');
const MoviesListValidator   = require('../../../validators/movies/list');

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
    },
    {
      method: 'POST',
      path: '/movies/{id}/locations',
      config: {
        handler: (request, reply) => {
          reply(Controller.addLocationToMovie(request.params.id, request.payload));
        },
        validate: {
          params: {
            id: Joi.number().required()
          },
          payload: {
            locationName: Joi.string().required()
          }
        }
      }
    }
  ]);
  next();
};

exports.register.attributes = {
  name: 'movies'
};
