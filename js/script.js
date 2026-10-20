$(document).ready(function () {
  "use strict";
  
  // Initialize hero carousel with auto-sliding and fade effect
  var heroCarousel = $('#heroCarousel');
  heroCarousel.carousel({
    interval: 3000,
    ride: 'carousel',
    wrap: true
  });
  
  // Additional event handlers for smooth fade transitions
  heroCarousel.on('slide.bs.carousel', function (e) {
    // Don't need direction-specific handling for fade effect
  });

  $(window).on("scroll", function () {
    var windscroll = $(window).scrollTop();
    if (windscroll >= 70) {
      $("#mainnavigationBar").addClass("sticky-nav");
    } else {
      $("#mainnavigationBar").removeClass("sticky-nav");
    }
  });
  $(".navbar-toggler").on("click", function () {
    var navbar = $("#mainnavigationBar");
    navbar.toggleClass("bg-nav");
  });

  // Magnific Popup
  $(".popup-vimeo").magnificPopup({
    disableOn: 700,
    type: "iframe",
    mainClass: "mfp-fade",
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false,
  });

  //Show password
  $(".viewPassword").click(function () {
    $(this).toggleClass("fa-eye fa-eye-slash");
    var input = $($(this).attr("toggle"));
    if (input.attr("type") == "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
  });
  // Scroll spy style start
  $(".nav-link").click(function () {
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
  });
  // Scroll spy
  $(document).ready(function () {
    $("body").scrollspy({
      target: "#scrol-nav",
      offset: 20,
    });

    // Navbar fade
    changeNavbar();

    $(window).scroll(function () {
      changeNavbar();
    });

    function changeNavbar() {
      var navbar = $("#scrol-nav");
      if ($(this).scrollTop() >= 20) {
        navbar.addClass("bg-light").removeClass("bg-transparent");
      } else if ($(this).scrollTop() < 20) {
        navbar.removeClass("bg-light").addClass("bg-transparent");
      }
    }
  });
  //end  Scroll spy style
});
