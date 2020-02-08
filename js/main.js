$( document ).ready(function() {

  var now = new Date();
  var today = now.getDay();
  var cards = document.querySelectorAll(".card");

  var shows_ended = []
  var missing_current_schedule = []
  var missing_current_trailer = []
  var missing_upcoming_trailer = []

  var upcoming_cards = []

  for(var i = 0; i < cards.length; i++) {
    var card = cards[i];
    $(card).addClass('filter-all')
    // Set dates for comparison
    var previewDate = new Date(card.getAttribute('data-preview'))
    var openingDate = new Date(card.getAttribute('data-opening'))
    var closing = card.getAttribute('data-closing')
    
    // Identify upcoming shows
    if (now < shiftDay(previewDate, -7)) {
      $(card).addClass('filter-upcoming')
      upcoming_cards.push({date: previewDate, card: $(card)})
      var previewDateString = moment(new Date(previewDate)).format('MMM Do')
      $('.list-group-date-callout', card).html('<small>'+previewDateString+'</small>')
    // Identify current shows
    } else{
      $(card).addClass('filter-current')
      // 
      if (now < previewDate) {
        var previewDateString = moment(previewDate).fromNow()
          $('.list-group-date-callout', card).html('<small>Begins '+previewDateString+'</small>')
          $('.list-group-date-callout', card).addClass('comingsoon')
      } else if (now >= previewDate && now < openingDate) {
        $('.list-group-date-callout', card).html("<small>In Previews Now</small>")
      } else {
        if (closing != undefined && closing != "") {
          var closingDate = new Date(closing)
          // Show ended
          if (now > closingDate) {
            shows_ended.push($('.show-title', card).text())
            $(card).parent().remove();
          } else {
            // Show is ending soon
            if (now > shiftDay(closingDate, -7)) {
              var closingDateString = moment(closingDate).fromNow()
              $('.list-group-date-callout', card).html('<small>Ends '+closingDateString+'</small>')
            } else {
              var closingDateString = moment(closingDate).format('MMM Do')
              $('.list-group-date-callout', card).html('<small>Ends '+closingDateString+'</small>')
            }
            if (now > shiftDay(closingDate, -30)) {
              $('.list-group-date-callout', card).addClass('ending')
            }
          }
        } else {
          $('.list-group-date-callout', card).remove()
          $('.list-group-item-action', card).last().addClass('last')
        }
      }
      
    }
    // Find any missing trailers and add to array
    if (!$('.modal-video', card).length) {
      if  (now < openingDate) {
        missing_upcoming_trailer.push($('.show-title', card).text())
      } else {
        missing_current_trailer.push($('.show-title', card).text())
      }
    }
    // Find any missing schedule and add to array
    if (!$('.text-schedule-title', card).length) {
      if  (now >= openingDate) {
        missing_current_schedule.push($('.show-title', card).text())
      }
    }
  }
  // Remove upcoming from the now playing section
  $('.filter-upcoming').parent().remove()

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

  // Build upcpming section
  var upcoming_cards_grouped_by_dates = []
  var sorted_upcoming_cards = upcoming_cards.sort((a, b) => a.date - b.date)
  $(sorted_upcoming_cards).each(function(index, value) {
    var month = moment(value.date).format('MMMM YYYY')
    if (!(month in upcoming_cards_grouped_by_dates)) {
      upcoming_cards_grouped_by_dates[month] = []
    } 
    upcoming_cards_grouped_by_dates[month].push(value.card)
  })

  for (date in upcoming_cards_grouped_by_dates) {
    $('#upcoming').append('<h3 class="pv-6 mt-4">'+date+'</h3>')
    $('#upcoming').append('')
    var row = upcoming_cards_grouped_by_dates[date]
    var rows = []
    for (key in row) {
      var card = row[key]
      //$('.fav-button', card).hide()
      $('.tickets', card).hide()
      rows.push('<div class="col-md-2 col-6 pt-4" >'+$(card).parent().html()+'</div>')
    }
    $('#upcoming').append('<div class="row card-columns">'+rows.join("\n")+'</div>') 
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
    // Filter Favorites
    var favFilter = getCookie('favFilter')
    if (!favFilter) {
      favFilter = "false"
      setCookie('favFilter', favFilter, 365)
    }

    $('.card.filter-all').parent().hide()
    var filterFavorites = (favFilter == "true")
    if (filterFavorites) {
      $('.card.isFavorite').parent().show()
      $('.fav-filter-button').addClass('isActive')
    } else {
      $('.card.filter-all').parent().show()
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

  function shiftDay(date, offset) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset);
  }

  // Log to console
  if (shows_ended.length) {
    console.log("SHOWS ENDED")
    console.log(shows_ended.join("\n")) 
  }
  if (missing_current_schedule.length) {
    console.log("SHOWS MISING SCHEDULE")
    console.log(missing_current_schedule.join("\n")) 
  }
  if (missing_current_trailer.length) {
    console.log("SHOWS MISING TRAILER")
    console.log(missing_current_trailer.join("\n"))
  }

});