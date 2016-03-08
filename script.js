var terms = new Array();

function wordClick() {
    if ($(this).hasClass('leaf-selected')) return;

    $thoughtBox = $(this).parent().parent();
}

function thoughtInputKeydown(key) {
    if (key.which == 13) {  // enter key
        text = $(this).val();
        words = text.split(' ');

        $thoughtBox = $(this).parent();
        $thoughtWords = $thoughtBox.children('.thought-words');

        $wordList = $thoughtWords.children('.word-list');
        $wordList.html('');
        words.forEach(function(word) {
            $wordSpan = $('<span>');
            $wordSpan.addClass('thought-word');
            $wordSpan.html(word);
            $wordSpan.click(wordClick);
            $wordList.append($wordSpan);
        })

        $(this).hide();
        $thoughtWords.show();
    }
}

function addEmptyThoughtBox(parents) {
    $thoughtBox = $('<div>');
    $thoughtBox.addClass('container thought-box');
    $thoughtBox.attr('parents', parents);

    $thoughtInput = $('<input type="text">');
    if (parents.length > 0) {
        $thoughtInput.attr('placeholder', 'What is ' + parents[parents.length - 1] + '?');
    } else {
        $thoughtInput.attr('placeholder', 'Clear your mind...');
    }
    $thoughtInput.addClass('thought-input');
    $thoughtInput.keydown(thoughtInputKeydown);
    $thoughtBox.append($thoughtInput);

    $thoughtWords = $('<div>');

    $wordList = $('<div>');
    $wordList.addClass('word-list');
    $thoughtWords.append($wordList);

    $thoughtWords.addClass('thought-words');
    $thoughtWords.hide();
    $thoughtBox.append($thoughtWords);

    $('.thoughts').append($thoughtBox);
}

function introToggle() {
    var $introduction = $('.introduction');

    if ($introduction.is(':visible')) {
        $introduction.slideUp('fast');
        $(this).html('Show intro');
    } else {
        $introduction.slideDown('fast')
        $(this).html('Got it');
    }
}

function main() {
    $('#intro-toggle').click(introToggle);
    addEmptyThoughtBox([]);
}

$(document).ready(main);
