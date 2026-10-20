$(document).ready(function() {
  // Function to get URL parameters
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  // Get product name from URL parameter
  const productSlug = getUrlParameter('name');
  
  if (productSlug) {
    // Get product data for this slug
    getProductBySlug(productSlug, function(product) {
      if (product) {
        // Update page title
        document.title = `Elder Pharmaceuticals - ${product.name}`;
        
        // Update product details
        // Use responsive image function to render product image
        renderProductImage($('#product-image-container'), product.image, product.name);
        
        $('#product-name').text(product.name);
        $('#product-category span').text(product.category);
        $('#product-price').text(`₹${product.price}`);
        $('#product-description').text(product.description);
        
        // Update features
        const $featuresList = $('#product-features');
        $featuresList.empty();
        product.features.forEach(feature => {
          $featuresList.append(`<li>${feature}</li>`);
        });
        
        // Update contact link
        $('#contact-link').attr('href', `/contact/?product=${encodeURIComponent(product.slug)}`);
        
        // Get products in the same category for related products
        getProductsByCategory(product.category, function(categoryProducts) {
          // Filter out the current product
          const relatedProducts = categoryProducts.filter(p => p.slug !== product.slug).slice(0, 3);
          
          const $relatedContainer = $('#related-products');
          $relatedContainer.empty();
          
          if (relatedProducts.length > 0) {
            // Add a divider before related products
            $('.product-container').addClass('mb-5');
            
            relatedProducts.forEach(related => {
              const relatedId = `related-image-${related.slug.replace(/\W+/g, '-')}`;
              $relatedContainer.append(`
                <div class="col-lg-4 col-md-6">
                  <div class="related-product">
                    <a href="/product/?name=${related.slug}">
                      <div class="related-product-image" id="${relatedId}">
                      </div>
                      <div class="related-product-details">
                        <h4>${related.name} <span class="related-product-price">₹${related.price || 'Contact for pricing'}</span></h4>
                      </div>
                    </a>
                  </div>
                </div>
              `);
              
              // Initialize responsive image for this related product
              renderProductImage($(`#${relatedId}`), related.image, related.name);
            });
          } else {
            $('.row.mt-5.pt-4').hide();
          }
        });
      } else {
        // Product not found
        $('#product-container').html('<div class="col-12 text-center"><h2>Product not found</h2><p>The product you are looking for does not exist.</p><a href="/products/" class="btn btn-primary">View All Products</a></div>');
        $('.related-products').hide();
      }
    });
  } else {
    // No product specified, redirect to products page
    window.location.href = '/products/';
  }
});