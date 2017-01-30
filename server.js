const Hapi = require('hapi');
const Path = require('path');
const Hoek = require('hoek');
var ItemStore = require('./lib/itemStore');
var UserStore = require('./lib/userStore');

// var mysql      = require('mysql');
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '',
//   database : 'es_expensesplitter'
// });
// connection.connect();
// connection.query('SELECT * from es_users', function(err, rows) {
//   if (err) throw err;
//   console.log('The current time is: ', rows[0]);
// });


ItemStore.initialize();
UserStore.initialize();
const server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: Path.join(__dirname, './')
      }
    }
  }
});
server.register(require('inert'), (err) => {

  if(err) {
    throw err;
  }
});

server.register(require('vision'), (err) => {

  Hoek.assert(!err, err);
  server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname,
    path: 'templates'
  });
});

server.connection({ port: 3000 });

server.register(require('hapi-auth-cookie'), function(err) {
	if(err) console.log(err);

	server.auth.strategy('default', 'cookie', {
		password: 'passwords-to-be-less-than-32',
		redirectTo: '/login',
		isSecure: false
	});

	server.auth.default('default');
});


server.ext('onRequest', function(request, reply) {
  console.log('Request received' + request.path);
  reply.continue();
});

server.ext('onPreResponse', function(request, reply) {
  if(request.response.isBoom) {
    return reply.view('error', request.response);
  }
  reply.continue();
});


server.route(require('./lib/routes'));

server.start(function() {
  console.log('Listening on ' + server.info.uri);
}); 
