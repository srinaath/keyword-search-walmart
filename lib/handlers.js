const Joi = require('joi'),
  Boom = require('boom');
var ItemStore = require('./itemStore');
var UserStore = require('./userStore');
var Handlers = {};

// Schema validation
var loginSchema = Joi.object().keys({
	email: Joi.string().email().required(),
	password: Joi.string().max(32).required()
});

var registerSchema = Joi.object().keys({
	name: Joi.string().max(50).required(),
	email: Joi.string().email().required(),
	password: Joi.string().max(32).required()
});

// Start Handlers
Handlers.searchHandler = function(request, reply) {
  if(request.query.keyword) {
    var searchWord = request.query.keyword;
    if(searchWord.length > 0) {
      var matchedIds = ItemStore.getMatchingIds(searchWord);
      if(matchedIds.length > 0) {
        reply.view('results', { matchedIds: matchedIds });
      } else {
        reply(Boom.badRequest("No search results found"));
      }
    } else {
      reply(Boom.badRequest("Invalid search term"));
    }
  } else {
    reply(Boom.badRequest("Invalid query parameters"));
  }

}

Handlers.loginHandler = function(request, reply) {
	Joi.validate(request.payload, loginSchema, function(err, val) {
		if(err) {
			return reply(Boom.unauthorized('Credentials did not validate'));
		}
		UserStore.validateUser(val.email, val.password, function(err, user) {
			if(err) {
				return reply(err);
			}
			request.auth.session.set(user);
			reply.redirect('/');
		});
	});
};

Handlers.logoutHandler = function(request, reply) {
	request.auth.session.clear();
	reply.redirect('/');
};

Handlers.registerHandler = function(request, reply) {
  console.log('Register Handler');
	Joi.validate(request.payload, registerSchema, function(err, val) {
		if(err) {
      console.log('failed');
			return reply(Boom.unauthorized('Credentials did not validate'));
		}
		UserStore.createUser(val.name, val.email, val.password, function(err) {
			if(err) {
				return reply(err);
			}
			reply.redirect('/login');
		});
	});
};

module.exports = Handlers;
