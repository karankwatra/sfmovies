'use strict';

const Joi = require('joi');

module.exports = Joi.object().keys({
  title: Joi.string().min(1).max(255).optional(),
  year: Joi.number().integer().min(1878).max(9999).optional(),
  from_year: Joi.number().integer().min(1878).max(9999).optional(),
  to_year: Joi.number().integer().min(1878).max(9999).optional(),
  location: Joi.string().min(1).max(255).optional()
}).oxor('to_year', 'year').oxor('from_year', 'year').and('from_year', 'to_year');
