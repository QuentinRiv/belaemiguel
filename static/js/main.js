

// Intersection Observer : fade-in au scroll
const animatedElements = document.querySelectorAll('.story-img, .story-text, .event-item, .couple.item, .gallery-item');
const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
}, { root: null, rootMargin: '0px', threshold: 0.2 });
animatedElements.forEach(el => observer.observe(el));

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".gallery-item").forEach((item, index) => {
    if (index >= 1) item.style.transitionDelay = `${100 * (index - 1)}ms`;
  });
});

$(window).on("load", function() {

    // preloader
    $(".preloader").delay(600).fadeOut("slow");

    // home section slideshow
    let slideIndex = $(".slide.active").index();
    const slideLen = $(".slide").length;

    function slideShow(){
        $(".slide").removeClass("active").eq(slideIndex).addClass("active");
        $(".diapo_img").removeClass("active").eq(slideIndex).addClass("active");
        if(slideIndex == slideLen-1) {
            slideIndex = 0;
        }
        else {
            slideIndex++;
        }
        setTimeout(slideShow, 5000);
    }

    slideShow();
});

// ===== RSVP form =====
$(document).ready(function () {
  // Toggle yes/no buttons
  $(document).on("click", ".rsvp-toggle-btn", function () {
    $(".rsvp-toggle-btn").removeClass("active");
    $(this).addClass("active");
  });

  // Submit
  $("#rsvp-form").on("submit", function (e) {
    e.preventDefault();

    var name = $("#rsvp-name").val().trim();
    var attending = $(".rsvp-toggle-btn.active").attr("data-value") === "yes";

    if (!name) {
      $("#rsvp-name").focus();
      return;
    }

    sendRSVP(name, attending);

    var msgKey = attending ? "form.confirmation_yes" : "form.confirmation_no";
    $("#rsvp-confirmation-text").text(t(msgKey));
    $("#rsvp-form").addClass("hidden").css("display", "none");
    $("#rsvp-confirmation").removeClass("hidden");
  });
});

function sendRSVP(name, attending) {
  // TODO: brancher sur Telegram ou autre backend
  console.log("RSVP:", name, attending ? "présent" : "absent");
}
// ===== RSVP form end =====

$(document).ready( function() {
  // fixed header
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $(".header").addClass("fixed");
    } else {
      $(".header").removeClass("fixed");
    }
  });

  // Scroll
  $(".header a").click(function (e) {
    var scroll_index = $(this).attr("data-scroll-nav");
    var elem = $("body").find(`section[data-scroll-nav='${scroll_index}']`);
    console.log($(elem));
    $("html").animate(
      {
        scrollTop: $(elem).offset().top - 50,
      },
      800 //speed
    );
  });

  // witness filter
  witnessFilter($(".filter-btn.active").attr("data-target"));
  $(".filter-btn").click(function () {
    if ($(this).hasClass("active")) {
      return;
    }
    witnessFilter($(this).attr("data-target"));
  });
  function witnessFilter(target) {
    //target = groom ou bride
    $(".filter-btn").removeClass("active");
    $(".filter-btn[data-target='" + target + "']").addClass("active");
    $(".witness-item").hide();
    $(".witness-item[data-target='" + target + "']").fadeIn();

    $(".filter-img").removeClass("active");
    $(".filter-img[data-target='" + target + "']").addClass("active");
  }

  // Big Photos
  const wHeight = $(window).height();
  $(".gallery-popup .gp-img").css("max-height", wHeight + "px");

  let itemIndex = 0;
  const totalGalleryItems = $(".gallery-item").length;

  $(".gallery-item").click(function () {
    itemIndex = $(this).index();
    $(".gallery-popup").addClass("open");
    $(".gallery-popup .gp-img").hide();
    gpSlideShow();
  });

  $(".gp-controls .next").click(function () {
    nextImage();
  });

  $(".gp-controls .prev").click(function () {
    previousImage();
  });

  function nextImage() {
    if (itemIndex === totalGalleryItems - 1) {
      itemIndex = 0;
    } else {
      itemIndex++;
    }
    $(".gallery-popup .gp-img").fadeOut(function () {
      gpSlideShow();
    });
  }

  function previousImage() {
    if (itemIndex === 0) {
      itemIndex = totalGalleryItems - 1;
    } else {
      itemIndex--;
    }
    $(".gallery-popup .gp-img").fadeOut(function () {
      gpSlideShow();
    });
  }

  function closeGallery() {
    $(".gallery-popup").removeClass("open");
  }

  // Écouter l'événement keydown sur le document
  $(document).on("keydown", function (event) {
    // Vérifier si la touche appuyée est la flèche droite (code 39)
    if ($(".gallery-popup").hasClass("open")) {
      if (event.keyCode === 39) {
        nextImage();
      }
      if (event.keyCode === 37) {
        previousImage();
      }
      if (event.keyCode === 27) {
        closeGallery();
      }
    }
  });

  function gpSlideShow() {
    const imgSrc = $(".gallery-item")
      .eq(itemIndex)
      .find("img")
      .attr("data-large");
    $(".gallery-popup .gp-img").fadeIn().attr("src", imgSrc);
    $(".gp-counter").text(itemIndex + 1 + "/" + totalGalleryItems);
  }

  // close gallery popup
  $(".gp-close").click(function () {
    closeGallery();
});

  // hide gallery popup when clicked outside
  $(".gallery-popup").click(function (event) {
    if ($(event.target).hasClass("open")) {
      $(".gallery-popup").removeClass("open");
    }
  });

  // witness filter
  galleryFilter($(".gallery_tag.active").attr("data-filter"));
  $(".gallery_tag").click(function () {
    if ($(this).hasClass("active")) {
      return;
    }
    galleryFilter($(this).attr("data-filter"));
  });
  function galleryFilter(target) {
    //target = groom ou bride
    $(".gallery_tag").removeClass("active");
    $(".gallery_tag[data-filter='" + target + "']").addClass("active");
  }

  /* === Mixitup filter portfolio === */
  let mixerPortfolio = mixitup(".images", {
    selectors: {
      target: ".gallery-item"
    },
    animation: {
        duration: 300
    }
  });

})