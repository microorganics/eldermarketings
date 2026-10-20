$(document).ready(function() {
  // Function to get URL parameters
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  // Check if there's a product parameter
  var productSlug = getUrlParameter('product');
  
  if (productSlug) {
    // Get product data for more accurate information
    getProductBySlug(productSlug, function(product) {
      // Set the hidden field value
      $('#product-interest').val(productSlug);
      
      // Use product name from data if available, otherwise format from slug
      const productName = product ? product.name : productSlug.replace(/-/g, ' ').replace(/\b\w/g, function(l) { return l.toUpperCase() });
      
      // Show the product interest box
      $('#product-interest-display').show();
      $('#product-interest-name').text(productName);
      
      // Pre-populate message with product inquiry
      var defaultMessage = "I am interested in learning more about " + productName + ". Please provide more information about this product.";
      $('#floatingTextarea2').val(defaultMessage);
    });
  }
});