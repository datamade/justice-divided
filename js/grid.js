var makeGrid = function(id, total, num_per_row, subpop1 = 0, subpop2 = 0) { 
  selector = 'div.grid#' + id
  
  $(selector).append('<span class="red"></span>')
  
  // if this isn't the arrests grid
  if (id.split('_')[0] != 'arrests') {
    $(selector).append('<span class="gray"></span>')
  }

  for (i = 0; i < total; i++) {

    if ( i < subpop1 || !Boolean(subpop1) ) { 
      el = $(selector +' span:first-child') 
    } else if ( i < subpop2 || !Boolean(subpop2) ) { 
      el = $(selector + ' span:nth-child(2)') 
    } else { 
      el = $(selector) 
    }

    if (Boolean(i) & !(i % num_per_row)) { el.append('<br>') }

    el.append('<i class="fa fa-male fa-fw" aria-hidden="true"></i>') 
  }
}

makeGrid('base_pop_a', 3250, 50, 15, 650);
makeGrid('base_pop_b', 3250, 50, 1, 650);
makeGrid('marijuana_a', 650, 25, 15);
makeGrid('marijuana_b', 650, 25, 1);
makeGrid('arrests_a', 15, 5);
makeGrid('arrests_b', 1, 1);
