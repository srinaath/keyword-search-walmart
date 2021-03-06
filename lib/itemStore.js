var filestream = require('fs');
var request = require('request');
var async = require('async');
var each = require('async-each-series');
var ItemStore = {};

ItemStore.apiUrl = "";
ItemStore.format = "";
ItemStore.key = "";
ItemStore.items = [];

ItemStore.initialize = function() {
  getUrlDetails();
  loadsItems();
};

function getUrlDetails() {
  var file = filestream.readFileSync('./config.json');
  var configDetails = JSON.parse(file.toString());
  ItemStore.apiUrl = configDetails.apiUrl;
  ItemStore.format = configDetails.format;
  ItemStore.key = configDetails.key;
}

function loadsItems() {
  var file = filestream.readFileSync('./items.json');
  var itemColl = [];
  itemColl = JSON.parse(file.toString()).itemCollection;
  each(itemColl, function(element, next) {
    setTimeout(function() {
      var itemUrl = formUrl(element);
      fetchItem(itemUrl);
      next();
    }, 300);
  }, function(err) {
    if(err) {
      reply.view('error');
    }
  });
}

function fetchItem(itemUrl) {
  request(itemUrl, function(error, response, body) {
    if(!error && response.statusCode == 200) {
      var msgBody = JSON.parse(body);
      var item = msgBody;
      ItemStore.items.push(item);
    }
  }).on('error', function(err) {
    reply(Boom.badRequest("Server error occured while fetching " + itemUrl));
  });
}

var containsWord = function(desc, searchWord) {
  if(desc.toLowerCase().includes(searchWord.toLowerCase())) {
    return true;
  } else {
    return false;
  }
}

ItemStore.getMatchingIds = function(searchTerm) {
  var matchedIds = [];
  console.log(searchTerm);
  ItemStore.items.forEach(function(itemVal, index, array) {
    if(containsWord(itemVal.longDescription, searchTerm)) {
      matchedIds.push(itemVal);
    }
  });
  return matchedIds;
}

function formUrl(itemId) {
  var itemUrl = ItemStore.apiUrl + itemId + "?" + ItemStore.format + "&apiKey=" + ItemStore.key;
  console.log(itemUrl);
  return itemUrl;
}

module.exports = ItemStore;
