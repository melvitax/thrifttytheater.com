var now = new Date();
var today = now.getDay();
var weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var selectedRow;
var rows = document.querySelectorAll(".row");

for(var i = 0; i < rows.length; i++) {
  var row = rows[i];

  // Make rows expandable
  row.querySelector('.row-header').addEventListener('click', function(){
    'use strict';
    var thisRow = this.parentNode.parentNode;
    var allRows = document.querySelectorAll('.row')
    // Close expanded row
    var j, aRow;
    if (selectedRow && (thisRow.getAttribute('id') == selectedRow.getAttribute('id'))) {
      thisRow.classList.remove('expanded');
      for(j = 0; j < allRows.length; j++) {
        aRow = allRows[j];
        aRow.classList.remove('dimmed');
      }
      document.location.href = '#-'+selectedRow.getAttribute('id');
      selectedRow = null;
    // Expand row
    } else {
      var isSwitchingRows = (selectedRow);
      if (isSwitchingRows) {
        selectedRow.classList.remove('expanded');
        selectedRow.classList.add('dimmed');
        thisRow.classList.remove('dimmed');
        thisRow.classList.add('expanded');
        selectedRow = thisRow;
      } else {
        thisRow.classList.add('expanded');
        selectedRow = thisRow;
        for(j = 0; j < allRows.length; j++) {
          aRow = allRows[j];
          if (aRow.getAttribute('id') != selectedRow.getAttribute('id')) {
            aRow.classList.add('dimmed');
          }
        }
      }
      document.location.href = '#'+selectedRow.getAttribute('id');
    }
  });

  // Hide Previews if already passed
  var previewDate = new Date(row.getAttribute('preview'));
  var openingDate = new Date(row.getAttribute('opening'));
  var twoWeeks = 12096e5 // two weeks in milliseconds

  if (now < new Date(previewDate - twoWeeks)) {
    row.classList.add('upcoming');
    console.log(row.getAttribute('id')+' upcoming and hidden')
  } else if (now >= new Date(previewDate - twoWeeks) && now < openingDate) {
    if (row.querySelector('.previews')) {
        row.querySelector('.previews').classList.add('active');
    } else {
      console.log(row.getAttribute('id')+' no previews to show')
    }
  } else {
    row.querySelector('.performances').classList.add('active');
    if (row.querySelector('.previews')) {
        console.log(row.getAttribute('id')+' previews expired')
    }
  }

  // Highlight shows closing in the next two weeks
  var closing = row.getAttribute('closing');
  if (closing != undefined) {
    var closingDate = new Date(closing);
    if (now > closingDate) {
      console.log(row.getAttribute('id')+' show expired');
      row.style.display = 'none';
    } else if (now > new Date(closingDate - twoWeeks)) {
      this.classList.add('closing');
    }
  }

  // Copy today's events to the collapssed view
  var timetables = row.querySelectorAll('.timetable.active');
  for(var j = 0; j < timetables.length; j++) {
    var timetable = timetables[j];
    var days = timetable.querySelectorAll('.day-column');
    row.querySelector('.row-header').querySelector('.today').innerHTML = days[today].innerHTML
  }

  // Toggle cost description
  var costs = row.querySelectorAll('.cost-title');
  for(var j = 0; j < costs.length; j++) {
    var cost = costs[j];
    cost.addEventListener('click', function(){
      'use strict';
      if (this.parentNode.classList.contains('expanded')) {
        this.parentNode.classList.remove('expanded');
      } else {
        this.parentNode.classList.add('expanded');
      }
      event.preventDefault();
    });
  }

  // Close row button
  row.querySelector('.close-row').addEventListener('click', function(){
    this.parentNode.parentNode.querySelector('.row-header').click();
  })

}


window.lazySizesConfig = {
  addClasses: true
};

// lazy loading for background images
document.addEventListener('lazybeforeunveil', function(e){
  'use strict';
  var bg = e.target.getAttribute('data-bg');
  if(bg){
      e.target.style.backgroundImage = 'url(' + bg + ')';
  }
});

// Reveal header when scrolling
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var siteHeader = document.querySelector('#site-header');
var headerHeight = siteHeader.offsetHeight;
window.onscroll = function() {
  'use strict';
  didScroll = true;
};
function hasScrolled() {
  'use strict';
  var start = window.pageYOffset;
  if(Math.abs(lastScrollTop - start) <= delta) {
    return;
  }
  if( (start > lastScrollTop && start > headerHeight) || (start < delta) ) {
    siteHeader.classList.remove('is-down');
    siteHeader.classList.add('is-up');
  } else {
    var body = document.body;
    var html = document.documentElement;
    var documentHeight = Math.max( body.scrollHeight, body.offsetHeight,
                           html.clientHeight, html.scrollHeight, html.offsetHeight );
    if (start + window.innerHeight < documentHeight) {
      siteHeader.classList.remove('is-up');
      siteHeader.classList.add('is-down');
    }
  }
  lastScrollTop = start;
}
setInterval(function() {
  'use strict';
  if(didScroll) {
    hasScrolled();
    didScroll = false;
  }
}, 250);

// Scroll to top
function scrollTo(element, to, duration) {
  'use strict';
  if (duration < 0) return;
  var difference = to - element.scrollTop;
  var perTick = difference / duration * 10;
  setTimeout(function() {
      element.scrollTop = element.scrollTop + perTick;
      if (element.scrollTop === to) return;
      scrollTo(element, to, duration - 10);
  }, 10);
}
document.querySelector("#site-header").querySelector("h1").addEventListener('click', function(e){
  'use strict';
  e.preventDefault();
  scrollTo(document.body, 0, 300);
});

// Add date to title
document.querySelector("#site-header").querySelector("h1").innerHTML = weekdays[now.getDay()] + ' ' + months[now.getMonth()] + ' ' + now.getDate();

// JS Player
var jsplayerlinks = document.querySelectorAll(".js-player-link");
for(var i = 0; i < jsplayerlinks.length; i++) {
  var jsplayerlink = jsplayerlinks[i];
  jsplayerlink.addEventListener('click', function(e){
    'use strict';
    var hasTouch = 'ontouchstart' in window;
    e.preventDefault();
    var videoID = this.getAttribute('href').split('v=')[1];
    var width = 560, height = 315;//min: 560x315
    var autoplay = (hasTouch) ? '' : '&autoplay=1';
    var iframe = '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + videoID + '?showinfo=0&modestbranding=0&color=white'+autoplay+'" frameborder="0" allowfullscreen></iframe>';
    document.querySelector(".js-player-wrapper").classList.add('is-open');
    document.querySelector(".js-player").innerHTML = iframe;
  })
}

document.querySelector('.js-player-close').addEventListener('click', function(){
  'use strict';
  document.querySelector(".js-player").innerHTML = '';
  document.querySelector(".js-player-wrapper").classList.remove('is-open');
});
