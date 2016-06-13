const Joi = require('joi'),
  Boom = require('boom');
var ItemStore = require('./itemStore');
var Handlers = {};

Handlers.searchHandler = function(request, reply) {
	if(request.query.keyword){
		var searchWord = request.query.keyword;
		if(searchWord.length > 0){
			var matchedIds = ItemStore.getMatchingIds(searchWord);
			if(matchedIds.length>0){
				reply.view('results', {matchedIds:matchedIds} );
			}
			else{
				reply(Boom.badRequest("No search results found"));
			}
		}
		else{
			reply(Boom.badRequest("Invalid search term"));	
		}
	}
	else{
		reply(Boom.badRequest("Invalid query parameters"));
	}
	
} 

module.exports = Handlers;
