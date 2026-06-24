

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

  // Toggle "bringing a +1?" yes/no
  $(document).on("click", ".rsvp-plusone-btn", function () {
    $(".rsvp-plusone-btn").removeClass("active");
    $(this).addClass("active");

    var bringingPlusOne = $(this).attr("data-value") === "yes";
    $("#rsvp-plusone-firstname-field").toggleClass("hidden", !bringingPlusOne);
    $("#rsvp-plusone-lastname-field").toggleClass("hidden", !bringingPlusOne);

    if (!bringingPlusOne) {
      $("#rsvp-plusone-firstname").val("");
      $("#rsvp-plusone-lastname").val("");
    }
  });

  // Toggle "bringing children?" yes/no
  $(document).on("click", ".rsvp-kids-btn", function () {
    $(".rsvp-kids-btn").removeClass("active");
    $(this).addClass("active");

    var bringingKids = $(this).attr("data-value") === "yes";
    $("#rsvp-kids-count-field").toggleClass("hidden", !bringingKids);
    $("#rsvp-kids-ages-field").toggleClass("hidden", !bringingKids);

    if (bringingKids) {
      renderKidsAgeInputs();
    } else {
      $("#rsvp-kids-ages").empty();
    }
  });

  // Rebuild the age inputs whenever the count changes
  $(document).on("input change", "#rsvp-kids-count", renderKidsAgeInputs);

  // Re-render age placeholders when the language changes
  document.addEventListener("i18n:applied", function () {
    if ($(".rsvp-kids-btn.active").attr("data-value") === "yes") {
      renderKidsAgeInputs();
    }
  });

  function renderKidsAgeInputs() {
    var count = parseInt($("#rsvp-kids-count").val(), 10);
    if (isNaN(count) || count < 1) count = 1;
    if (count > 10) count = 10;

    var $container = $("#rsvp-kids-ages");
    var existing = {};
    $container.find(".rsvp-kid-row").each(function (i) {
      existing[i] = {
        firstName: $(this).find(".rsvp-kid-firstname").val(),
        lastName: $(this).find(".rsvp-kid-lastname").val(),
        age: $(this).find(".rsvp-kid-age").val(),
      };
    });

    function tr(key, fallback) {
      var val = t(key);
      return val === key ? fallback : val;
    }

    $container.empty();
    for (var i = 0; i < count; i++) {
      // Fall back gracefully if translations aren't loaded yet (t() returns the key)
      var label = tr("form.kid_age_label", "Child {n}").replace("{n}", i + 1);
      var firstPh = tr("form.firstname_placeholder", "First name");
      var lastPh = tr("form.lastname_placeholder", "Last name");
      var agePh = tr("form.kid_age_placeholder", "Age");

      var $row = $('<div class="rsvp-kid-row"></div>');
      $('<span class="rsvp-kid-label"></span>').text(label).appendTo($row);

      var $fields = $('<div class="rsvp-kid-fields"></div>');
      var $first = $(
        '<input type="text" class="rsvp-input rsvp-kid-firstname" autocomplete="off" />'
      )
        .attr("aria-label", label + " - " + firstPh)
        .attr("placeholder", firstPh);
      var $last = $(
        '<input type="text" class="rsvp-input rsvp-kid-lastname" autocomplete="off" />'
      )
        .attr("aria-label", label + " - " + lastPh)
        .attr("placeholder", lastPh);
      var $age = $(
        '<input type="number" class="rsvp-input rsvp-kid-age" min="0" max="17" step="1" inputmode="numeric" />'
      )
        .attr("aria-label", label + " - " + agePh)
        .attr("placeholder", agePh);

      if (existing[i]) {
        if (existing[i].firstName !== undefined) $first.val(existing[i].firstName);
        if (existing[i].lastName !== undefined) $last.val(existing[i].lastName);
        if (existing[i].age !== undefined) $age.val(existing[i].age);
      }

      $fields.append($first, $last, $age);
      $row.append($fields);
      $container.append($row);
    }
  }

  // Submit
  $("#rsvp-form").on("submit", function (e) {
    e.preventDefault();

    var firstName = $("#rsvp-firstname").val().trim();
    var lastName = $("#rsvp-lastname").val().trim();
    var attending = $(".rsvp-toggle-btn.active").attr("data-value") === "yes";
    var bringingPlusOne =
      $(".rsvp-plusone-btn.active").attr("data-value") === "yes";
    var plusOne = null;
    if (bringingPlusOne) {
      plusOne = {
        firstName: $("#rsvp-plusone-firstname").val().trim(),
        lastName: $("#rsvp-plusone-lastname").val().trim(),
      };
    }
    var bringingKids =
      $(".rsvp-kids-btn.active").attr("data-value") === "yes";

    var kids = [];
    if (bringingKids) {
      $("#rsvp-kids-ages .rsvp-kid-row").each(function () {
        var kFirst = $(this).find(".rsvp-kid-firstname").val().trim();
        var kLast = $(this).find(".rsvp-kid-lastname").val().trim();
        var kAge = $(this).find(".rsvp-kid-age").val().trim();
        if (kFirst !== "" || kLast !== "" || kAge !== "") {
          kids.push({ firstName: kFirst, lastName: kLast, age: kAge });
        }
      });
    }

    if (!firstName) {
      $("#rsvp-firstname").focus();
      return;
    }

    if (bringingPlusOne && !plusOne.firstName) {
      $("#rsvp-plusone-firstname").focus();
      return;
    }

    var $submit = $(this).find(".rsvp-submit");
    $submit.prop("disabled", true);

    sendRSVP(firstName, lastName, attending, kids, plusOne).always(function () {
      $submit.prop("disabled", false);

      var msgKey = attending ? "form.confirmation_yes" : "form.confirmation_no";
      $("#rsvp-confirmation-text").text(t(msgKey));
      $("#rsvp-form").addClass("hidden").css("display", "none");
      $("#rsvp-confirmation").removeClass("hidden");
    });
  });
});

// ===== Telegram notification =====
//
// Note : ce site est 100% statique (GitHub Pages), il n'y a pas de serveur pour
// cacher le token. Les deux valeurs ci-dessous seront donc visibles dans le code
// source de la page. C'est un choix assumé pour une page de mariage privée
// (au pire, du spam dans ton propre chat). Pas de .env possible ici.
//
// Configuration (une seule fois) :
//   1. Sur Telegram, parle à @BotFather, envoie /newbot et suis les étapes.
//      Il te répond avec un token du style 123456789:AAExxxxxxxxxxxxxxxxxxxxxxx
//   2. Envoie un message à ton nouveau bot (pour qu'il ait le droit de t'écrire),
//      ou ajoute-le à un groupe.
//   3. Récupère ton chat id : ouvre dans un navigateur
//      https://api.telegram.org/bot<TOKEN>/getUpdates après avoir écrit au bot,
//      et lis result[].message.chat.id.
//   4. Colle les deux valeurs ci-dessous.
var TELEGRAM_BOT_TOKEN = "8944876278:AAFc8BDB3SzzcgBAcDsy4VFaGri_v1A14a0"; // ex : "123456789:AAE..."
var TELEGRAM_CHAT_ID = "6715849629"; // ex : "987654321"

function sendRSVP(firstName, lastName, attending, kids, plusOne) {
  var fullName = (firstName + " " + lastName).trim();
  var status = attending ? "✅ will be present" : "❌ won't be able to come";
  var text =
    "💌 New RSVP\n" +
    "Name : " + fullName + "\n" +
    "Answer : " + status;

  if (plusOne && plusOne.firstName) {
    var plusOneName = (plusOne.firstName + " " + plusOne.lastName).trim();
    text += "\n+1 : " + plusOneName;
  }

  if (kids && kids.length) {
    text += "\nChildren : " + kids.length;
    kids.forEach(function (kid) {
      var kidName = (kid.firstName + " " + kid.lastName).trim();
      if (!kidName) kidName = "(no name)";
      text += "\n  • " + kidName + (kid.age !== "" ? " (" + kid.age + ")" : "");
    });
  }

  console.log("RSVP:", fullName, attending ? "present" : "absent", "+1:", plusOne, "kids:", kids);

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn(
      "Telegram non configuré : renseigne TELEGRAM_BOT_TOKEN et TELEGRAM_CHAT_ID dans main.js."
    );
    return $.Deferred().resolve().promise();
  }

  return $.ajax({
    url: "https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage",
    method: "POST",
    data: {
      chat_id: TELEGRAM_CHAT_ID,
      text: text,
    },
  })
    .done(function () {
      console.log("RSVP envoyé sur Telegram.");
    })
    .fail(function (xhr) {
      console.error("Échec de l'envoi Telegram :", xhr.status, xhr.responseText);
    });
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
