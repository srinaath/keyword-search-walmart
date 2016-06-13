const uuid = require('uuid'),
  Joi = require('joi'),
  Boom = require('boom');

var ItemStore = require('./itemStore');
var Handlers = {};

Handlers.searchHandler = function(request, reply) {
  ItemStore.getMatchingIds(request.params.searchTerm, reply);
}

module.exports = Handlers;
