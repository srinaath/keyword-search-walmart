(function() {
  "use strict";
  var $resultIdBox=$('.result-ids');
  var $errorBox=$('.error-text');

  $('#search-btn').click(
    function() {
      var searchUrl = "items/search/" + $('#keyword-text').val()
      $.get(searchUrl).done(function(matchedProducts) {
          if(matchedProducts && matchedProducts.length > 0) {
            $resultIdBox.show();
            $errorBox.hide();
            var val = "The matched product Ids from the catalog are " + matchedProducts.join();
            $resultIdBox.text(val);
          } else {
            $resultIdBox.hide();
            $errorBox.show();
            $errorBox.text("Unfortunately no products were found matching your keyword");
          }
        })
        .error(function(error) {
          $resultIdBox.hide();
          $errorBox.show();
          $errorBox.text("Unfortunately no products were found matching your keyword");
        });
    });
}());
