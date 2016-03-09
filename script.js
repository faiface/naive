var thoughtBoxTemplate =
'<div class="container thought-box">\n' +
'   <div class="container thought-input-box">\n' +
'       <input type="text" class="thought-input"/>\n' +
'   </div>\n' +
'   <div class="container thought-words-box">\n' +
'       <div class="button square-button purple-button delete-button" style="float: left">&#10005;</div>' +
'       <div class="button square-button purple-button edit-button" style="float: right">&#9997;</div>' +
'       <div class="container thought-words">\n' +
'       </div>\n' +
'   </div>\n' +
'</div>\n'

function wordClick() {
    //TODO
}

function toggleThoughtBox($thoughtBox) {
    if ($thoughtBox.children('.thought-words-box').is(':visible')) {
        $thoughtBox.children('.thought-words-box').hide();
        $thoughtBox.children('.thought-input-box').show();
        $thoughtBox.children('.thought-input-box').children('.thought-input').focus();
    } else {
        $thoughtBox.children('.thought-input-box').hide();
        $thoughtBox.children('.thought-words-box').show();
    }
}

function editButtonClick() {
    $thoughtBox = $(this).parent().parent();
    toggleThoughtBox($thoughtBox);
}

function thoughtInputKeydown(key) {
    if (key.which == 13) {  // enter key
        text = $(this).val();
        words = text.split(' ');

        $thoughtBox = $(this).parent().parent();
        $thoughtWords = $thoughtBox.children('.thought-words-box');

        $wordList = $thoughtWords.children('.thought-words');
        $wordList.html('');
        words.forEach(function(word) {
            $wordSpan = $('<span>');
            $wordSpan.addClass('thought-word');
            $wordSpan.html(word);
            $wordSpan.click(wordClick);
            $wordList.append($wordSpan);
        })

        toggleThoughtBox($thoughtBox);
    }
}

function newThoughtBox(parents) {
    $thoughtBox = $(thoughtBoxTemplate);
    $thoughtBox.attr('parents', parents);

    $thoughtInput = $thoughtBox.children('.thought-input-box').children('.thought-input');
    $thoughtInput.keydown(thoughtInputKeydown);

    if (parents.length > 0) {
        $thoughtInput.attr('placeholder', 'What is ' + parents[parents.length - 1] + '?');
    } else {
        $thoughtInput.attr('placeholder', 'Clear your mind...');
    }

    $thoughtWordsBox = $thoughtBox.children('.thought-words-box');
    $thoughtWordsBox.children('.edit-button').click(editButtonClick);

    $thoughtWordsBox.hide();

    return $thoughtBox;
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
    $('.thoughts').append(newThoughtBox([]));
}

$(document).ready(main);
