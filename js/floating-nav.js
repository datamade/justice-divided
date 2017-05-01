$('h2[id]').waypoint(function(direction) {
    id = $(this.element).attr('id');
    $('a[href="#' + id + '"]').addClass('active');
    $('#floating-nav > a[href!="#' + id + '"]').each(function() { 
        $(this).removeClass('active');
    });
}, {offset: '15%'});