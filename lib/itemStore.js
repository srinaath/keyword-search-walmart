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
    },1000);
  }, function(err) {
    if(err){
      reply.view('error');
    }
  });
}

function fetchItem(itemUrl) {
      request(itemUrl, function(error, response, body) {
        if(!error && response.statusCode == 200) {
          var msgBody = JSON.parse(body);
          var item = {
            "itemId": msgBody.itemId,
            "desc": String(msgBody.longDescription)
          };
          ItemStore.items.push(item);
        }
      }).on('error', function(err) {
          console.log("Server error occured while fetching " + itemUrl);
      });
}

var containsWord = function(desc, searchWord) {
  var desired = desc.replace(/[^\w\s]/gi, '');
  if(desired.toLowerCase().includes(searchWord.toLowerCase())){
    return true;
  }
  else{
    return false;
  }
  // // //Doing case insensitive search
  // // ^(.*?(\bpass\b)[^$]*)$
  // return new RegExp('\b'+ searchWord+'\b').test(desc.toLowerCase());
}

ItemStore.getMatchingIds = function(searchTerm, response) {
  var matchedIds = [];
  async.forEachOf(ItemStore.items, function(itemVal, key, callback) {
    if(containsWord(itemVal.desc, searchTerm)) {
      matchedIds.push(itemVal.itemId);
    }
    callback();
  }, function(err) {
    response(matchedIds);
  });
}

function formUrl(itemId) {
  var itemUrl = ItemStore.apiUrl + itemId + "?" + ItemStore.format + "&apiKey=" + ItemStore.key;
  console.log(itemUrl);
  return itemUrl;
}

module.exports = ItemStore;
