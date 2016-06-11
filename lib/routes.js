var Handlers = require('./handlers');

var Routes = [{
  path: '/',
  method: 'GET',
  handler: {
    file: 'templates/index.html'
  }
}, {
  path: '/assets/{path*}',
  method: 'GET',
  handler: {
    directory: {
      path: 'public',
      listing: false
    }
  }
}];

module.exports = Routes;