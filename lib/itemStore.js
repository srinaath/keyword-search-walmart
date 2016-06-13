var filestream = require('fs');
var request = require('request');
var async=require('async');
var ItemStore = {};

ItemStore.apiUrl = "";
ItemStore.format = "";
ItemStore.key = "";
ItemStore.items = [];

ItemStore.initialize = function() {
  getUrlDetails();
  loadItems();
};

function getUrlDetails() {
  var file = filestream.readFileSync('./config.json');
  var configDetails = JSON.parse(file.toString());
  ItemStore.apiUrl = configDetails.apiUrl;
  ItemStore.format = configDetails.format;
  ItemStore.key = configDetails.key;
}

function loadItems() {
  var itemsCollection = [];
  var file = filestream.readFileSync('./items.json');
  var itemColl = [];
  itemColl = JSON.parse(file.toString()).itemCollection;
  itemColl.forEach(
    function(element, index, array) {
      var itemUrl = formUrl(element);
      request(itemUrl, function(error, response, body) {
        if(!error && response.statusCode == 200) {
          var msgBody = JSON.parse(body);
          var item = {
            "itemId": msgBody.itemId,
            "desc": msgBody.shortDescription
          };
          ItemStore.items.push(item);
          console.log(item);
        }
      }).on('error', function(err) {
        reply.view('error');
      });
    });
}

  var containsWord= function (string, word) {
    return new RegExp('(?:[^.\w]|^|^\\W+)' + word + '(?:[^.\w]|\\W(?=\\W+|$)|$)').test(string);
}

ItemStore.getMatchingIds = function(searchTerm,response) {
  var matchedIds = [];
  async.forEachOf(ItemStore.items, function(itemVal, key, callback) {
    if(containsWord(itemVal.desc,searchTerm)){
      matchedIds.push(itemVal.itemId);
      //console.log(itemVal.itemId + "match");
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
