$( document ).ready(function() {

  var today = moment()
  var cards = document.querySelectorAll(".card");
  var shows_ended = []
  var missing_current_schedule = []
  var upcoming_cards = []
  
  moment.updateLocale('en', {
    calendar : {
        lastDay : '[Yesterday]',
        sameDay : '[Today]',
        nextDay : '[Tomorrow]',
        lastWeek : '[Last] dddd',
        nextWeek : 'dddd',
        sameElse : 'L'
    }
  });

  for(var i = 0; i < cards.length; i++) {

    var card = cards[i];
    $(card).addClass('filter-all')
    
    // Set dates for comparison
    var previewDate = moment(card.getAttribute('data-preview'), "YYYY-MM-DD")
    var openingDate = moment(card.getAttribute('data-opening'), "YYYY-MM-DD")
    var returnDate = moment(card.getAttribute('data-returns'), "YYYY-MM-DD")
    var aWeekBeforePreview = moment(card.getAttribute('data-preview'), "YYYY-MM-DD").subtract(7, 'days')
    var aWeekBeforeReturn = moment(card.getAttribute('data-returns'), "YYYY-MM-DD").subtract(7, 'days')
    var twoWeeksAfterPreviews = moment(card.getAttribute('data-preview'), "YYYY-MM-DD").add(14, 'days')
    var twoWeeksAfterReturn = moment(card.getAttribute('data-returns'), "YYYY-MM-DD").add(14, 'days')
    var closingTag = card.getAttribute('data-closing')

    // Identify upcoming shows
    if (today.isBefore(returnDate, 'date')) {
      $(card).addClass('filter-upcoming')
      upcoming_cards.push({date: returnDate, card: $(card)})
      if (today.isAfter(aWeekBeforeReturn, 'date')) {
        $('.list-group-date-callout', card).html('<small>Begins '+returnDate.calendar()+'</small>')
        $('.list-group-date-callout', card).addClass('comingsoon')
      } else {
        $('.list-group-date-callout', card).html('<small>'+returnDate.format('MMM Do')
        +'</small>')
      }
    // Identify upcoming shows
    } else if (today.isBefore(previewDate, 'date')) {
      $(card).addClass('filter-upcoming')
      upcoming_cards.push({date: previewDate, card: $(card)})
      if (today.isAfter(aWeekBeforePreview, 'date')) {
        $('.list-group-date-callout', card).html('<small>Begins '+previewDate.calendar()+'</small>')
        $('.list-group-date-callout', card).addClass('comingsoon')
      } else {
        $('.list-group-date-callout', card).html('<small>'+previewDate.format('MMM Do')
        +'</small>')
      }
    // Identify current shows
    } else{
      $(card).addClass('filter-current')
      // In Previews
      if (today.isSameOrAfter(previewDate, 'date') && today.isSameOrBefore(openingDate, 'date')) {
        if (today.isSame(previewDate, 'date')) {
          $('.list-group-date-callout', card).html("<small>Begins Today</small>")
        } else {
          $('.list-group-date-callout', card).html("<small>In Previews Now</small>")
        }
        if (today.isBefore(twoWeeksAfterPreviews, 'date')) {
          $('.list-group-date-callout', card).addClass('comingsoon') // adds green bg
        }
      } else {
        if (closingTag != undefined && closingTag != "") {
          var closingDate = moment(closingTag, "YYYY-MM-DD")
          var aWeekBeforeClosing = moment(closingTag, "YYYY-MM-DD").subtract(14, 'days')
          // Show ended
          if (today.isAfter(closingDate, 'date')) {
            shows_ended.push($('.show-title', card).text())
            $(card).parent().remove();
          } else {
            // Show is ending soon
            if (today.isAfter(aWeekBeforeClosing, 'date')) {
              var closingDateString = closingDate.calendar()
              $('.list-group-date-callout', card).html('<small>Ends '+closingDateString+'</small>')
              $('.list-group-date-callout', card).addClass('ending')
            } else {
              var closingDateString = closingDate.format('MMM Do')
              $('.list-group-date-callout', card).html('<small>Ends '+closingDateString+'</small>')
            } 
          }
        } else {
          $('.list-group-date-callout', card).remove()
          $('.list-group-item-action', card).last().addClass('last')
        }
      }
      
    }
    // Find any missing schedule and add to array
    if (!$('.text-schedule-title', card).length) {
      if  (today.isAfter(openingDate, 'date')) {
        missing_current_schedule.push($('.show-title', card).text())
      }
    }
  }
  // Remove upcoming from the now playing section
  $('.filter-upcoming').parent().remove()

  // Build upcoming section
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
    $('#upcoming').append('<h3 class="pt-4 pb-2">'+date+'</h3>')
    $('#upcoming').append('')
    var row = upcoming_cards_grouped_by_dates[date]
    var rows = []
    for (key in row) {
      var card = row[key]
      $('.tickets', card).hide()
      rows.push('<div class="col-6 col-sm-4 col-md-3 col-lg-2 pt-4" >'+$(card).parent().html()+'</div>')
    }
    $('#upcoming').append('<div class="row card-columns">'+rows.join("\n")+'</div>') 
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

  // Fav Show Buttons
  var faved = getCookie('favedShows')
  if (faved) {
    var array = faved.split(",")
    if (array) {
      for(var i = 0; i < array.length; i++) {
        let rawID = array[i]
        $('#card__'+rawID).addClass('isFavorite')
      }
    }
  }
  
  // Fav Button Logic
  $('.fav-button').click(function() {
    var id = $(this).parent().parent().attr('id').split("__")[1]
    console.log('id: '+id)
    $('#card__'+id).toggleClass('isFavorite')
    var isFavorite = $('#card__'+id).hasClass('isFavorite')
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

  // Filter Button Logic
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
    var filterFavorites = (favFilter == "true")
    if (filterFavorites) {
      $('.fav-filter-button').addClass('isActive')
      $('.card').each(function(index, card) {
        if ($(card).hasClass('isFavorite')) {
          $(card).parent().show()
        } else {
          $(card).parent().hide()
        }
      })
    } else {
      $('.card.filter-all').parent().show()
      $('.fav-filter-button').removeClass('isActive')
    }
  }
  
  // Show the main div now that eveything has been filtered
  $('main').removeClass('hide')


  //checkForHashtag()

  // Check for hashtag
  function checkForHashtag() {
    var id = location.hash.replace("#", "")
    if (id != "") {
      var card = $("#card__"+id)
      var title = $('.show-title', card).text()
      var dataURL = $('.poster-link', card).attr('data-url')
      $('#modal').modal()
      loadModalContent(dataURL)
    }
  }
  
  // Modal - onShow()
  $('#modal').on('show.bs.modal', function (e) {
    var card = $(e.relatedTarget).parent().parent()
    var id = $(card).attr('id').split("__")[1]
    var title = $('.show-title', card).text()
    window.history.pushState({}, title, "#"+id);
    var url = $(e.relatedTarget).data('url')
    loadModalContent(url)
  })

  // Modal - inHide()
  $('#modal').on('hide.bs.modal', function (e) {
    window.history.pushState({}, "Show Hacker", "/");
  })

  // Load Modal content
  function loadModalContent(url) {
    $.get( url+'index.html', function( data ) {
      $('#modal .modal-content').html( data );
    });
    ga('send', 'pageview', {
      'page': url
    });
  }

  // Animate on Intersect
  $('body').removeClass('no-observer')
  const observerOptions = {
    rootMargin: '0px',
    threshold: 0.2
  }
  const $obsvItem = $('.animate')
  IntersectionObserver.prototype.POLL_INTERVAL = 400
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.intersectionRatio > 0) {
        entry.target.classList.add('is-active')
        observer.unobserve(entry.target)
      } else {
        entry.target.classList.remove('is-active')
      }
    })
    return entries
  }, observerOptions)
  $obsvItem.each(function (e) {
    observer.observe(this)
  })

  // Cookies
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

  // Log to console
  if (shows_ended.length) {
    console.log("SHOWS ENDED")
    console.log(shows_ended.join("\n")) 
  }

});