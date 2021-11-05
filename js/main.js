$( document ).ready(function() {

  var today = moment()
  var shows_ended = []
  
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

  // Upcoming shows 
  $('.row.upcoming .card').each(function() {
    // Set dates for comparison
    var previewDate = moment($(this).data('preview'), "YYYY-MM-DD")
    var aWeekBeforePreview = moment($(this).data('preview'), "YYYY-MM-DD").subtract(7, 'days')
    // Has opened and should be moved to now playing section
    if (today.isSameOrAfter(previewDate, 'date')) {
      $(this).parent().appendTo('.row.nowplaying').attr('class', $('.row.nowplaying .col').first().attr('class'))
    // About to open
    } else if (today.isAfter(aWeekBeforePreview, 'date')) {
      $('.list-group-date-callout', $(this)).html('<small>Begins '+previewDate.calendar()+'</small>')
      $('.list-group-date-callout', $(this)).addClass('comingsoon')
    // Show opening date
    } else {
      $('.list-group-date-callout', $(this)).html('<small>'+previewDate.format('MMM Do')+'</small>')
    }
  })

  // Now Playing Shows
  $('.row.nowplaying .card').each(function() {
    var previewDate = moment($(this).data('preview'), "YYYY-MM-DD")
    var openingDate = moment($(this).data('opening'), "YYYY-MM-DD")
    // In Previews
    if (today.isSameOrAfter(previewDate, 'date') && today.isSameOrBefore(openingDate, 'date')) {
      var twoWeeksAfterPreviews = moment($(this).data('preview'), "YYYY-MM-DD").add(14, 'days')
      if (today.isSame(previewDate, 'date')) {
        $('.list-group-date-callout', $(this)).html("<small>Begins Today</small>")
      } else {
        $('.list-group-date-callout', $(this)).html("<small>In Previews Now</small>")
      }
      if (today.isBefore(twoWeeksAfterPreviews, 'date')) {
        $('.list-group-date-callout', $(this)).addClass('comingsoon') // adds green bg
      }
    } else {
      // Check closing date
      var closingTag = $(this).data('closing')
      if (closingTag != undefined && closingTag != "") {
        var closingDate = moment(closingTag, "YYYY-MM-DD")
        var twoWeeksBeforeClosing = moment(closingTag, "YYYY-MM-DD").subtract(14, 'days')
        // Show ended
        if (today.isAfter(closingDate, 'date')) {
          shows_ended.push($('.show-title', $(this)).text())
          $(this).parent().remove();
        } else {
          // Show is ending soon
          if (today.isAfter(twoWeeksBeforeClosing, 'date')) {
            var aWeekBeforeClosing = moment(closingTag, "YYYY-MM-DD").subtract(7, 'days')
            var closingThisWeek = (today.isAfter(aWeekBeforeClosing, 'date'))
            var closingDateString = closingThisWeek ? closingDate.calendar() : closingDate.format('MMM Do')
            $('.list-group-date-callout', $(this)).html('<small>Ends '+closingDateString+'</small>')
            $('.list-group-date-callout', $(this)).addClass('ending')
          } else {
            var closingDateString = closingDate.format('MMM Do')
            $('.list-group-date-callout', $(this)).html('<small>Ends '+closingDateString+'</small>')
          } 
        }
      } else {
        $('.list-dates', $(this)).remove()
        $('.list-group-item-action', $(this)).last().addClass('last')
      }
    }
  })

  // Enable Popovers
  document.querySelectorAll('[data-bs-toggle="popover"]').forEach(function (popover) {
      new bootstrap.Popover(popover)
  })

  // Fav Show Buttons
  var faved = getCookie('favedShows')
  if (faved) {
    var array = faved.split(",")
    if (array) {
      for(var i = 0; i < array.length; i++) {
        let rawID = array[i]
        $('#card__'+rawID).attr('data-tag-favorites', 'true')
        $('#fav__'+rawID).addClass('isFavorite')
      }
    }
  }
  
  // Fav Button Logic
  $('.fav-button').click(function() {
    var id = $(this).attr('id').split("__")[1]
    console.log('id: '+id)
    $(this).toggleClass('isFavorite')
    var isFavorite = $(this).hasClass('isFavorite')
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

  // Filter Tags Logic
  var activeFilters = false
  // iterate over tags in drop down
  $('.tag').each(function() {
    var tag = $(this).attr('id').split("__")[1]
    if (hasTagParameter(tag) === true) {
      $(this).addClass('active')
      $('[data-tag-'+tag+']').addClass('activeFilter')
      $('.active-tags').append('<button class="btn btn-outline-primary me-2" type="button" id="removeTag__'+tag+'" onclick="setTagParameter(\''+tag+'\', false);">'+tags[tag]+' <i class="far fa-times-circle"></i></button>')
      activeFilters = true
    } else {
      $(this).removeClass('active')
    }
    $(this).click(function() {
      var tag = $(this).attr('id').split("__")[1]
      let value = (hasTagParameter(tag) === true) ? false : true
      setTagParameter(tag, value)
    })
  })
  if (activeFilters) {
    $('.card').each(function() {
      if (!$(this).hasClass('activeFilter')) {
        $(this).parent().remove()
      }
    })
  }

  // Clean up
  $('.row').each(function() {
    if ($(this).children().length == 0) {
      $(this).prev().remove()
      $(this).remove()
    }
  })

  // Show the main div now that eveything has been filtered
  $('main').delay( 800 ).removeClass('hide')

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

  // Log to console
  if (shows_ended.length) {
    console.log("SHOWS ENDED")
    console.log(shows_ended.join("\n")) 
  }

  // Missing schedulle 
  
  $('.row.nowplaying .card').each(function() {
    if (!$(this).hasClass('hasSchedule')) {
      console.log("MISSING SCHEDULE: "+$('.show-title', $(this)).text())
    }
    if (!$(this).hasClass('hasHeader')) {
      console.log("MISSING HEADER: "+$('.show-title', $(this)).text())
    }
  })

});

// URL Parameters
function hasTagParameter(key) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has(key)
}

function setTagParameter(key, value) {
  const urlParams = new URLSearchParams(window.location.search);
  if (value === true) {
    urlParams.set(key, value);
  } else {
    urlParams.delete(key)
  }
  window.location.search = urlParams;
}

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