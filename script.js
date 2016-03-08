function intro_toggle() {
    var $introduction = $('.introduction')

    if ($introduction.is(':visible')) {
        $introduction.slideUp('fast')
        $(this).html('Show intro')
    } else {
        $introduction.slideDown('fast')
        $(this).html('Got it')
    }
}

function main() {
    $('#intro-toggle').click(intro_toggle)
}

$(document).ready(main)
