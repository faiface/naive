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

function sentenceToWords(sentence) {
    var words = sentence.split(' ');
    var filtered_words = [];
    words.forEach(function(word) {
        if (word.match(/[a-zA-Z]/i)) {
            filtered_words.push(word);
        }
    })
    return filtered_words
}

function wordsToSentence(words) {
    return words.join(' ');
}

function showInputBox($thoughtBox) {
    var words = [];
    $thoughtBox.children('.thought-words-box').children('.thought-words').children('span').each(function(index) {
        words.push($(this).html());
    });
    var sentence = wordsToSentence(words);

    $thoughtBox.children('.thought-input-box').children('.thought-input').val(sentence);
    $thoughtBox.children('.thought-words-box').hide();
    $thoughtBox.children('.thought-input-box').show();
    $thoughtBox.children('.thought-input-box').children('.thought-input').focus();
}

function showWordsBox($thoughtBox) {
    var sentence = $thoughtBox.children('.thought-input-box').children('.thought-input').val();
    var words = sentenceToWords(sentence);

    if (words.length == 0) return;

    var $thoughtWords = $thoughtBox.children('.thought-words-box').children('.thought-words');
    $thoughtWords.html('');
    words.forEach(function(word) {
        var $wordSpan = $('<span>');
        $wordSpan.addClass('thought-word');
        $wordSpan.html(word);
        $wordSpan.click(wordClick);
        $thoughtWords.append($wordSpan);
    });

    $thoughtBox.children('.thought-input-box').hide();
    $thoughtBox.children('.thought-words-box').show();
}

function toggleThoughtBox($thoughtBox) {
    if ($thoughtBox.children('.thought-words-box').is(':visible')) {
        showInputBox($thoughtBox);
    } else {
        showWordsBox($thoughtBox);
    }
}

function editButtonClick() {
    var $thoughtBox = $(this).parent().parent();
    showInputBox($thoughtBox);
}

function thoughtInputKeydown(key) {
    if (key.which == 13) {  // enter key
        var $thoughtBox = $(this).parent().parent();
        showWordsBox($thoughtBox);
    }
}

function thoughtInputOnblur() {
    var $thoughtBox = $(this).parent().parent();
    showWordsBox($thoughtBox);
}

function newThoughtBox(parents) {
    var $thoughtBox = $(thoughtBoxTemplate);
    $thoughtBox.attr('parents', parents);

    var $thoughtInput = $thoughtBox.children('.thought-input-box').children('.thought-input');
    $thoughtInput.keydown(thoughtInputKeydown);
    $thoughtInput.blur(thoughtInputOnblur);

    if (parents.length > 0) {
        $thoughtInput.attr('placeholder', 'What is ' + parents[parents.length - 1] + '?');
    } else {
        $thoughtInput.attr('placeholder', 'Clear your mind...');
    }

    var $thoughtWordsBox = $thoughtBox.children('.thought-words-box');
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
