$( document ).ready(function() {

  var now = new Date();
  var today = now.getDay();
  var cards = document.querySelectorAll(".card");

  var shows_ended = []
  var missing_current_schedule = []
  var missing_current_trailer = []
  var missing_upcoming_trailer = []

  for(var i = 0; i < cards.length; i++) {
    var card = cards[i];

    // Set dates for comparison
    var previewDate = new Date(card.getAttribute('data-preview'));
    var openingDate = new Date(card.getAttribute('data-opening'));
    var closing = card.getAttribute('data-closing');
    var oneWeek = 60480000 // in milliseconds

    // Show hasn't started
    if (now < (previewDate - oneWeek)) {
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
        console.log($('.show-title', card).text()+' show ended');
        shows_ended.push($('.show-title', card).text())
        $(card).parent().remove();
      } else if (now > new Date(closingDate - (oneWeek*4))) {
        $('.list-group-date-closing', card).removeClass('text-muted').addClass('text-danger')
      }
    }
    // Check for missing items
    var key = (now < openingDate) ? "upcoming" : "current"
    if (!$('.modal-video', card).length) {
      if  (now < openingDate) {
        missing_upcoming_trailer.push($('.show-title', card).text())
      } else {
        missing_current_trailer.push($('.show-title', card).text())
      }
    }
    if (!$('.text-schedule-title', card).length) {
      if  (now < openingDate) {

      } else {
        missing_current_schedule.push($('.show-title', card).text())
      }
    }

  }
  
  if (shows_ended.length) {
    console.log("SHOWS ENDED")
    console.log(shows_ended.join("\n")) 
  }
  if (missing_current_schedule.length) {
    console.log("MISING CURRENT SCHEDULE")
    console.log(missing_current_schedule.join("\n")) 
  }
  if (missing_current_trailer.length) {
    console.log("MISING CURRENT TRAILER")
    console.log(missing_current_trailer.join("\n"))
  }
  if (missing_upcoming_trailer.length) {
    //console.log("MISING UPCOMING TRAILER")
    console.log(missing_upcoming_trailer.join("\n"))
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

  // Favorite Shows: Read saved state and update each card
  var faved = getCookie('favedShows')
  if (faved) {
    var array = faved.split(",")
    if (array) {
      for(var i = 0; i < array.length; i++) {
        let rawID = array[i]
        $('.card__'+rawID).addClass('isFavorite')
      }
    }
  }

  // Fav Shows: Button logic
  $('.fav-button').click(function() {
    var id = $(this).attr('id').split("__")[1]
    $('.card__'+id).toggleClass('isFavorite')
    var isFavorite = $('.card__'+id).hasClass('isFavorite')
    var faved = getCookie('favedShows')
    var array = []
    if (faved) {
      array = faved.split(",")
    }
    if (isFavorite) {
      array.push(id)
    } else {
      var filtered = []
      for(var i = 0; i < array.length; i++) {
        var item = array[0]
        if (item != id) {
          filtered.push(item)
        }
      }
      array = filtered
    }
    var string = array.join(",")
    setCookie('favedShows', string, 365)
  })

  // Filter Dropdown: Button logic
  $('.dropdown-filter').click(function() {
    var filter = $(this).attr('id')
    setCookie('selectedFilter', filter, 365)
    updateUI()
  })

  // Filter Favorites: Button logic
  $('.fav-filter-button').click(function() {
    $(this).toggleClass('isActive')
    var showFavorites = $(this).hasClass('isActive')
    var value = (showFavorites) ? "true" : "false"
    setCookie('favFilter', value, 365)
    updateUI()
  })

  updateUI()
  
  function updateUI() {
    // Filter Dropdown
    var selectedFilter = getCookie('selectedFilter')
    if (!selectedFilter) {
      selectedFilter = 'filter-current'
      setCookie('selectedFilter', selectedFilter, 365)
    }
    var filterName = $('#'+selectedFilter).text()
    $('.btn-filter').text(filterName)
    // Filter Favorites
    var favFilter = getCookie('favFilter')
    if (!favFilter) {
      favFilter = "false"
      setCookie('favFilter', favFilter, 365)
    }
    $('.card.filter-all').parent().hide()
    var filterFavorites = (favFilter == "true")
    if (filterFavorites) {
      $('.card.'+selectedFilter+'.isFavorite').parent().show()
      $('.fav-filter-button').addClass('isActive')
    } else {
      $('.card.'+selectedFilter).parent().show()
      $('.fav-filter-button').removeClass('isActive')
    }
  }
  
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