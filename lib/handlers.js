const Joi = require('joi'),
  Boom = require('boom');
var ItemStore = require('./itemStore');
var Handlers = {};

Handlers.searchHandler = function(request, reply) {
	if(request.params.searchTerm && request.params.searchTerm.length!==0){
		ItemStore.getMatchingIds(request.params.searchTerm, reply);		
	}
	else{
		reply(Boom.badRequest("Invalid query parameters"));
	}
} 

module.exports = Handlers;
