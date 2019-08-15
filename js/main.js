$( document ).ready(function() {

  var now = new Date();
  var today = now.getDay();
  var cards = document.querySelectorAll(".card");

var missing_current_schedule = []
var missing_current_trailer = []
var missing_upcoming_schedule = []
var missing_upcoming_trailer = []

  for(var i = 0; i < cards.length; i++) {
    var card = cards[i];

    // Set dates for comparison
    var previewDate = new Date(card.getAttribute('data-preview'));
    var openingDate = new Date(card.getAttribute('data-opening'));
    var closing = card.getAttribute('data-closing');
    var closingWindow = 2.419e+9 // four weeks in milliseconds

    // Show hasn't started
    if (now < previewDate) {
      $('.list-group-date-previews', card).removeClass('text-muted').addClass('text-success')
      $('.list-group-date-opening', card).removeClass('text-muted').addClass('text-success')
      $(card).addClass('filter-upcoming')
    } else{
      $(card).addClass('filter-current')
    }
    $(card).addClass('filter-all')


    // Show is in previews
    if (now > previewDate && now < openingDate) {
      $('.list-group-date-previews', card).html("<small>In Previews Now</small>")
    }
    // Show has started
    if (now >= openingDate) {
      $('.list-group-date-previews', card).remove();
      $('.list-group-date-opening', card).remove();
    }
    // Show is ending
    if (closing != undefined) {
      var closingDate = new Date(closing);
      if (now > closingDate) {
        console.log($('.card-title', card).text()+' show ended');
        $(card).parent().remove();
      } else if (now > new Date(closingDate - closingWindow)) {
        $('.list-group-date-closing', card).removeClass('text-muted').addClass('text-danger')
      }
    }
    // Check for missing items
    var key = (now < openingDate) ? "upcoming" : "current"
    if (!$('.modal-video', card).length) {
      if  (now < openingDate) {
        missing_upcoming_trailer.push($('.card-title', card).text())
      } else {
        missing_current_trailer.push($('.card-title', card).text())
      }
    }
    if (!$('.text-schedule-title', card).length) {
      if  (now < openingDate) {
        missing_upcoming_schedule.push($('.card-title', card).text())
      } else {
        missing_current_schedule.push($('.card-title', card).text())
      }
    }

  }
  if (missing_current_schedule.length) {
    console.log("MISING CURRENT SCHEDULE")
    console.log("   "+JSON.stringify(missing_current_schedule )) 
  }
  if (missing_current_trailer.length) {
    console.log("MISING CURRENT TRAILER")
    console.log("   "+JSON.stringify(missing_current_trailer))
  }
  if (missing_upcoming_schedule.length) {
    console.log("MISING UPCOMING SCHEDULE")
    console.log("   "+JSON.stringify(missing_upcoming_schedule))
  }
  if (missing_upcoming_trailer.length) {
    console.log("MISING UPCOMING TRAILER")
    console.log("   "+JSON.stringify(missing_upcoming_trailer))
  }

  // Enable Popovers
  $('[data-toggle="popover"]').popover()
  // Hide Popover when clicking anywhere outside popover
  $('body').on('click', function (e) {
    if ($(e.target).data('toggle') !== 'popover'
        && $(e.target).parents('[data-toggle="popover"]').length === 0
        && $(e.target).parents('.popover.in').length === 0) { 
        $('[data-toggle="popover"]').popover('hide');
    }
  });

  // Add and remove video from Modal
  $('.modal').on('show.bs.modal', function (e) {
    $('iframe', this).attr('src', $('iframe', this).attr('data-src')) 
  })
  $('.modal').on('hide.bs.modal', function (e) {
    $('iframe', this).attr('src', "")
  })

  // Nav
  $('.btn-filter-show').each(function (index, value) {
    $(this).click(function() {
      $('.btn-filter-show').removeClass("active")
      $(this).addClass("active")
      setCookie('selectedFilter', $(this).attr('id'), 365)
      $('.card.filter-all').parent().hide()
      $('.card.'+$(this).attr('id')).parent().show()
    })
  });
  var selectedFilter = getCookie('selectedFilter')
  if (!selectedFilter) {
    selectedFilter = 'filter-current'
  }
  $('#'+selectedFilter).trigger( "click" )


  function setCookie(c_name, value, exdays) {
    'use strict';
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
  }

  function getCookie(c_name) {
    'use strict';
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
  }

});