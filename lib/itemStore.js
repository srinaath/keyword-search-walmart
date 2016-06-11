var filestream = require('fs');
var request = require('request');
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
        }
      }).on('error', function(err) {
        console.log(err)
      });
    });
}


function formUrl(itemId) {
  var itemUrl = ItemStore.apiUrl + itemId + "?" + ItemStore.format + "&apiKey=" + ItemStore.key;
  console.log(itemUrl);
  return itemUrl;
}

module.exports = ItemStore;