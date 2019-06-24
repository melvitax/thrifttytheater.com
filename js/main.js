
var now = new Date();
var today = now.getDay();
var selectedRow;
var cards = document.querySelectorAll(".card");

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

for(var i = 0; i < cards.length; i++) {
  var card = cards[i];

  // Set dates for comparison
  var previewDate = new Date(card.getAttribute('data-preview'));
  var openingDate = new Date(card.getAttribute('data-opening'));
  var closing = card.getAttribute('data-closing');
  var twoWeeks = 12096e5 // two weeks in milliseconds

  // Highlight new shows
  if (now < previewDate) {
    card.classList.add('border-primary');
  }

  if (now > previewDate) {
    $('.list-group-date-preview', card).remove();
  }

  if (now > openingDate) {
    $('.list-group-date-opens', card).remove();
  }

  // Highlight shows closing in the next two weeks
  if (closing != undefined) {
    var closingDate = new Date(closing);
    if (now > closingDate) {
      console.log(card.getAttribute('id')+' show expired');
      $(card).parent().remove();
    } else if (now > new Date(closingDate - twoWeeks)) {
      card.classList.add('border-danger');
    }
  }


//   // Today's times
//   var timetable = row.querySelector('.timetable')
//   var todayDiv = row.querySelector('.todays-performance')
//   if (timetable) {
//     var days = row.querySelectorAll('.day');
//     todayDiv.innerHTML = days[today].querySelector('.day__time').innerHTML;
//   } else {
//     todayDiv.classList.add('todays-performance_none')
//     if (now >= new Date(previewDate)) {
//       console.log('previews started but have no timetable for ' + row.querySelector('.row-title').innerText )
//     }
//   }


}


// Add date to title
// document.querySelector(".header__title").innerHTML = document.querySelector(".header__title").innerHTML + ' - ' + moment(now).format('MMM D')


$('.modal').on('show.bs.modal', function (e) {
  $('iframe', this).attr('src', $('iframe', this).attr('data-src')) 
})
$('.modal').on('hide.bs.modal', function (e) {
  $('iframe', this).attr('src', "")
})