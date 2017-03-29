// globals
var arrestedDropout = 0;
var nonArrestedDropout = 0;


// helpers

// decide whether dot drops out
function determineOutcome(cls) {
  if ( cls.includes('arrested') ) {
    // p (arrested & do not graduate) = .75
    cls = Math.random() > 0.75 ? cls + ' graduate' : cls + ' dropout' 
  } else {
    // p (not arrested & do not graduate) = .53
    cls = Math.random() > 0.53 ? cls + ' graduate' : cls + ' dropout'
  }
  countOutcomes(cls);
  return cls
}

// increment appropriate tally
function countOutcomes(cls) {
  if ( cls.includes('dropout') ) {
    if ( cls.includes('arrested') ) { arrestedDropout++; }                         
                               else { nonArrestedDropout++; }
  }
}


// functionality
function addStudents() {
   arrestedOutcome = determineOutcome('student arrested')
   nonArrestedOutcome = determineOutcome('student')
   students = '<div class="' + arrestedOutcome + `"></div>
               <div class="` + nonArrestedOutcome + '"></div>'
   $('div#dropout').append(students)
} 

function removeStudents() {
  $('div.student').on('animationend oAnimationEnd webkitAnimationEnd', function() { 
      $(this).remove();
   })
}

function updateCount() {
  $('span#arrest-total').text(arrestedDropout);
  $('span#non-arrest-total').text(nonArrestedDropout);
}

function run(speed) {
  return setInterval(function() {
    addStudents();
    $.when( removeStudents() ).done( updateCount() ); 
  }, speed);
}
