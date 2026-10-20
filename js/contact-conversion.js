// Contact conversion tracking
document.addEventListener('DOMContentLoaded', function() {
  // Track clicks on navigation contact button
  const navContactButtons = document.querySelectorAll('.navbar-nav a[href="/contact"], a.btn.btn-links[href="/contact"]');
  navContactButtons.forEach(function(button) {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      gtag_report_conversion('/contact');
    });
  });

  // Track clicks on any "Contact Us" text links
  const contactTextLinks = document.querySelectorAll('a[href="/contact"]');
  contactTextLinks.forEach(function(link) {
    if (link.textContent.toLowerCase().includes('contact us')) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        gtag_report_conversion('/contact');
      });
    }
  });

  // Track form submissions on the contact page
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', function() {
      gtag_report_conversion();
    });
  }

  // Track all buttons with "Contact Us" text that link to the contact page
  const allButtons = document.querySelectorAll('.btn');
  allButtons.forEach(function(button) {
    if (
      button.textContent.toLowerCase().includes('contact us') || 
      button.textContent.toLowerCase().includes('get in touch') ||
      button.textContent.toLowerCase().includes('send message')
    ) {
      if (button.tagName === 'A' && button.getAttribute('href') === '/contact') {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          gtag_report_conversion('/contact');
        });
      } else if (button.closest('a') && button.closest('a').getAttribute('href') === '/contact') {
        button.closest('a').addEventListener('click', function(e) {
          e.preventDefault();
          gtag_report_conversion('/contact');
        });
      }
    }
  });
});
