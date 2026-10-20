// Function to render product images using the picture element
function renderProductImage(container, imageSrc, imageAlt) {
  // Default to placeholder if no image source provided
  if (!imageSrc) {
    container.html('<img src="/images/products/placeholder.png" alt="' + (imageAlt || 'Product Image') + '" class="img-fluid">');
    return;
  }

  // Check if image path has appropriate structure for picture element
  const imagePathParts = imageSrc.split('.');
  if (imagePathParts.length < 2) {
    // Invalid path, use fallback
    container.html('<img src="' + imageSrc + '" alt="' + (imageAlt || 'Product Image') + '" class="img-fluid" onerror="this.src=\'/images/products/placeholder.png\'">');
    return;
  }

  const imageExt = imagePathParts[imagePathParts.length - 1];
  const fileName = imageSrc.split('/').pop().split('.')[0];
  const dirName = imageSrc.substring(0, imageSrc.lastIndexOf(fileName));
  const imageBase = dirName + fileName + '-';
  
  // Build picture element
  let pictureHtml = '<picture class="responsive-image">';
  
  // AVIF format
  pictureHtml += '<source type="image/avif" ' +
    'srcset="' + imageBase + '480.avif 480w, ' +
    imageBase + '800.avif 800w, ' +
    imageBase + '1400.avif 1400w" ' +
    'sizes="(max-width: 480px) 480px, (max-width: 800px) 800px, 1400px">';
  
  // WebP format
  pictureHtml += '<source type="image/webp" ' +
    'srcset="' + imageBase + '480.webp 480w, ' +
    imageBase + '800.webp 800w, ' +
    imageBase + '1400.webp 1400w" ' +
    'sizes="(max-width: 480px) 480px, (max-width: 800px) 800px, 1400px">';
  
  // Original format (fallback)
  pictureHtml += '<img src="' + imageSrc + '" ' +
    'srcset="' + imageBase + '480.' + imageExt + ' 480w, ' +
    imageBase + '800.' + imageExt + ' 800w, ' +
    imageBase + '1400.' + imageExt + ' 1400w" ' +
    'sizes="(max-width: 480px) 480px, (max-width: 800px) 800px, 1400px" ' +
    'alt="' + (imageAlt || 'Product Image') + '" ' +
    'loading="lazy" ' +
    'decoding="async" ' +
    'onerror="this.onerror=null; this.srcset=\'\'; this.src=\'/images/products/placeholder.png\'">';
  
  pictureHtml += '</picture>';
  
  // Insert the picture element into the container
  container.html(pictureHtml);
}
