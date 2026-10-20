// product-data.js - Central module for handling product data

// Variable to store the loaded product data
let productData = null;

// Function to load product data from JSON file
function loadProductData(callback) {
  if (productData !== null) {
    // Data already loaded, return it immediately
    callback(productData);
    return;
  }

  // Use fetch API with priority hints for more efficient loading
  if ('connection' in navigator && (navigator.connection.saveData || navigator.connection.effectiveType.includes('2g'))) {
    // If on slow connection or save-data mode, use simpler data approach
    console.info('Using lightweight data approach due to network constraints');
    // Call callback with basic data structure to minimize payload
    callback({ 
      products: [], 
      categories: ['Tablets', 'Injections', 'Dry Syrups', 'Capsules'], 
      defaultFeatures: [
        "High quality formulation",
        "Manufactured to the highest standards",
        "Backed by Elder's quality assurance"
      ], 
      defaultPrice: "Contact for price" 
    });
    // Still load the data in the background for future use
    setTimeout(function() {
      $.getJSON('/js/data/products.json', function(data) { productData = data; });
    }, 2000);
    return;
  }
  
  // Use link preload for critical JSON if supported
  if ('fetch' in window) {
    fetch('/js/data/products.json', {
      priority: 'high', // Priority hint for browsers that support it
      cache: 'force-cache'
    })
    .then(response => response.json())
    .then(data => {
      // Store the data for future use
      productData = data;
      // Call the callback function with the data
      callback(data);
    })
    .catch(error => {
      console.error("Failed to load product data:", error);
      // Fall back to jQuery method on failure
      $.getJSON('/js/data/products.json')
        .done(function(data) {
          productData = data;
          callback(data);
        })
        .fail(function() {
          // Call callback with empty data structure in case of error
          callback({ products: [], categories: [], defaultFeatures: [], defaultPrice: "Contact for price" });
        });
    });
  } else {
    // Fallback for older browsers
    $.getJSON('/js/data/products.json')
      .done(function(data) {
        productData = data;
        callback(data);
      })
      .fail(function(jqxhr, textStatus, error) {
        console.error("Failed to load product data:", textStatus, error);
        callback({ products: [], categories: [], defaultFeatures: [], defaultPrice: "Contact for price" });
      });
  }
}

// Function to get a product by slug
function getProductBySlug(slug, callback) {
  loadProductData(function(data) {
    // Look for the product in the predefined list
    let product = data.products.find(p => p.slug === slug);
    
    // If not found, generate a product based on the slug
    if (!product) {
      product = generateProductFromSlug(slug, data);
    }
    
    // Return the product via callback
    callback(product);
  });
}

// Function to generate a product from a slug when not in the predefined list
function generateProductFromSlug(slug, data) {
  // Format product name from slug
  const formattedName = slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  // Try to get the product image
  const productImage = `/images/products/${slug}.png`;
  
  // Determine category based on product name (simplified)
  let category = "Tablets"; // Default category
  if (slug.toLowerCase().includes('syp') || slug.toLowerCase().includes('suspension')) {
    category = "Dry Syrups";
  } else if (slug.toLowerCase().includes('inj')) {
    category = "Injections";
  } else if (slug.toLowerCase().includes('capsule') || slug.toLowerCase().includes('cap')) {
    category = "Capsules";
  }
  
  // Generate a description based on the name
  const description = `${formattedName} — pharmaceutical product for improved healthcare. Please contact our sales team for detailed information and pricing.`;
  
  // Create a product object
  return {
    name: formattedName,
    slug: slug,
    category: category,
    price: data.defaultPrice,
    image: productImage,
    description: description,
    features: data.defaultFeatures || [
      "High quality formulation",
      "Manufactured to the highest standards",
      "Backed by Elder's quality assurance",
      "Part of our comprehensive healthcare portfolio"
    ]
  };
}

// Function to get products by category
function getProductsByCategory(category, callback) {
  loadProductData(function(data) {
    // Return all products if category is 'all'
    if (category === 'all') {
      callback(data.products);
      return;
    }
    
    // Filter products by category
    const filteredProducts = data.products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    callback(filteredProducts);
  });
}

// Function to get all products
function getAllProducts(callback) {
  loadProductData(function(data) {
    callback(data.products);
  });
}

// Function to get all categories
function getAllCategories(callback) {
  loadProductData(function(data) {
    callback(data.categories);
  });
}

// Function to get short description
function getShortDescription(description) {
  // Split the description at the first dash or em dash
  const splitDesc = description.split(/—|\s-\s/)[0];
  // Limit to 60 characters and add ellipsis if needed
  if (splitDesc.length > 60) {
    return splitDesc.substring(0, 60).trim() + '...';
  }
  return splitDesc;
}
