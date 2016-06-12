const uuid = require('uuid'),
  Joi = require('joi'),
  Boom = require('boom');

var ItemStore=require('./itemStore');
var Handlers = {};

Handlers.searchHandler = function(request, reply) {
	console.log(request.params.searchTerm);
	ItemStore.getMatchingIds(request.params.searchTerm);
	//reply.view('error');
}

module.exports = Handlers;
