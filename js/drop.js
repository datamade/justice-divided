// RUN VIZ

var dropout;

function isPaused() {
  return $('#dropout-control').text().includes('Play');
}

$('#dropout-control').click(function() {
  if ( isPaused() ) {
    dropout = runContinuous(150);
    $(this).html('<i class="fa fa-pause fa-fw"></i> Pause')
  } else {
    clearInterval(dropout);
    $(this).html('<i class="fa fa-play fa-fw"></i> Play');
  }       
})


// DEFINE VIZ

// globals
var totalStudents = 0;
var arrestedDropout = 0;
var nonArrestedDropout = 0;

// helpers
function determineOutcome(baseClass, p) {
  rand = Math.random();
  if ( rand <= p ) {
    outcome = baseClass + ' dropout';
  } else {
    outcome = baseClass + ' graduate';
  }
  countOutcome(outcome);
  return outcome;
}

function countOutcome(outcome) {
  totalStudents++; 
  if ( outcome.includes('dropout') ) {
    if ( outcome.includes('arrested') ) { 
      arrestedDropout++; 
    } else { 
      nonArrestedDropout++; 
    }
  }
}

// functionality
function addStudents() {
   arrestedOutcome = determineOutcome('student arrested', 0.73);
   nonArrestedOutcome = determineOutcome('student', 0.51);
   students = '<div class="' + arrestedOutcome + `"></div>
               <div class="` + nonArrestedOutcome + '"></div>';
   $('div#dropout').append(students);
} 

function removeStudents() {
  $('div.student').on('animationend oAnimationEnd webkitAnimationEnd', function() { 
    $(this).remove();
  })
}

function updateCount() {
  $('#arrest-count > :first-child').text(arrestedDropout);
  $('#non-arrest-count > :first-child').text(nonArrestedDropout);
  $('span.count').text(totalStudents / 2);
}

function runContinuous(speed) {
  return setInterval(function() {
    addStudents();
    $.when( removeStudents() ).done( updateCount() ); 
  }, speed);
}
