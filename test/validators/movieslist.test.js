'use strict';

const Joi = require('joi');

const MovieListValidator = require('../../lib/validators/movies/list');

describe('movie query validator', () => {

  describe('title', () => {

    it('is less than 255 characters', () => {
      const payload = { title: 'a'.repeat(260) };
      const result = Joi.validate(payload, MovieListValidator);

      expect(result.error.details[0].path[0]).to.eql('title');
      expect(result.error.details[0].type).to.eql('string.max');
    });

  });

  describe('year', () => {

    it('is after 1878', () => {
      const payload = {
        title: 'foo',
        year: 1800
      };
      const result = Joi.validate(payload, MovieListValidator);

      expect(result.error.details[0].path[0]).to.eql('year');
      expect(result.error.details[0].type).to.eql('number.min');
    });

    it('is limited to 4 digits', () => {
      const payload = {
        title: 'foo',
        year: 12345
      };
      const result = Joi.validate(payload, MovieListValidator);

      expect(result.error.details[0].path[0]).to.eql('year');
      expect(result.error.details[0].type).to.eql('number.max');
    });

    it('is not accompanied by a from_year', () => {
      const payload = {
        title: 'foo',
        from_year: 1900,
        year: 1900
      };
      const result = Joi.validate(payload, MovieListValidator);

      expect(result.error.details[0].message).to.eql('"from_year" is not allowed');
    });

    it('is not accompanied by a to_year', () => {
      const payload = {
        title: 'foo',
        to_year: 1900,
        year: 1900
      };
      const result = Joi.validate(payload, MovieListValidator);

      expect(result.error.details[0].message).to.eql('"to_year" is not allowed');
    });

  });

  describe('from_year', () => {

    it('is after 1878', () => {
      const payload = {
        title: 'foo',
        from_year: 1800
      };
      const result = Joi.validate(payload, MovieListValidator);

      expect(result.error.details[0].path[0]).to.eql('from_year');
      expect(result.error.details[0].type).to.eql('number.min');
    });

    it('is limited to 4 digits', () => {
      const payload = {
        title: 'foo',
        from_year: 12345
      };
      const result = Joi.validate(payload, MovieListValidator);

      expect(result.error.details[0].path[0]).to.eql('from_year');
      expect(result.error.details[0].type).to.eql('number.max');
    });

    it('is accompanied by a to_year', () => {
      const payload = {
        title: 'foo',
        from_year: 1900
      };
      const result = Joi.validate(payload, MovieListValidator);

      expect(result.error.details[0].context.missing[0]).to.eql('to_year');
    });

  });

  describe('to_year', () => {

    it('is after 1878', () => {
      const payload = {
        title: 'foo',
        to_year: 1800
      };
      const result = Joi.validate(payload, MovieListValidator);

      expect(result.error.details[0].path[0]).to.eql('to_year');
      expect(result.error.details[0].type).to.eql('number.min');
    });

    it('is limited to 4 digits', () => {
      const payload = {
        title: 'foo',
        to_year: 12345
      };
      const result = Joi.validate(payload, MovieListValidator);

      expect(result.error.details[0].path[0]).to.eql('to_year');
      expect(result.error.details[0].type).to.eql('number.max');
    });

    it('is accompanied by a from_year', () => {
      const payload = {
        title: 'foo',
        to_year: 1900
      };
      const result = Joi.validate(payload, MovieListValidator);

      expect(result.error.details[0].context.missing[0]).to.eql('from_year');
    });

  });

});
