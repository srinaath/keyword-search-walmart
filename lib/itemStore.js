var filestream = require('fs');
var ItemStore = {};

ItemStore.items = {};
ItemStore.apiUrl = "";
ItemStore.format = "";
ItemStore.key = "";

ItemStore.initialize = function() {
  getUrlDetails();
  ItemStore.items = loadItems();
};

function getUrlDetails() {
  var file = filestream.readFileSync('./config.json');
  var configDetails = JSON.parse(file.toString());
  ItemStore.apiUrl = configDetails.apiUrl;
  ItemStore.format = configDetails.format;
  ItemStore.key = configDetails.key;
}

function loadItems() {
  var file = filestream.readFileSync('./items.json');
  var itemColl = [];
  itemColl = JSON.parse(file.toString()).itemCollection;
  itemColl.forEach(
  	function(element, index, array){
  		console.log(element);
  	});
}


function formUrl(itemId){
	var itemUrl =ItemStore.apiUrl + itemId + "?" + ItemStore.format + "&apiKey=" + ItemStore.key;
	console.log(itemUrl);
	return itemUrl;
}

module.exports = ItemStore;
