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

var wordTree = {}
var paths = {};
var index = 0;
var activePath = []

function getNode(tree, path) {
    if (tree === undefined) return undefined;
    if (path.length == 0) return tree;
    return getNode(tree[path[0]], path.slice(1, path.length));
}

function deleteNode(node) {
    if (node === undefined) return;
    for (var child in node) {
        delete node[child];
    }
    delete node;
}

function lightUpPath(path) {
    $('.selected').removeClass('selected');

    var currentPath = [];
    for (var i = 0; i < path.length; i++) {
        var $thoughtBox = getNode(wordTree, currentPath)['@'];
        $thoughtBox.find('span').filter(function() {
            return $(this).html() == path[i];
        }).addClass('selected');
        currentPath.push(path[i]);
    }
}

function selectPath(path) {
    var matchesUntil;
    for (matchesUntil = 0; matchesUntil < path.length; matchesUntil++) {
        if (matchesUntil >= activePath.length || path[matchesUntil] != activePath[matchesUntil]) {
            break;
        }
    }

    var promise;

    for (var i = matchesUntil; i < activePath.length; i++) {
        var $thoughtBox = getNode(wordTree, activePath.slice(0, i + 1))['@'];

        $thoughtBox.slideUp('fast');
        if (i == activePath.length - 1) {
            promise = $thoughtBox.promise();
        }
    }

    activePath = path;

    var after = function() {
        lightUpPath(path);

        for (var i = matchesUntil; i < path.length; i++) {
            var $thoughtBox = getNode(wordTree, path.slice(0, i + 1))['@'];
            if ($thoughtBox === undefined) {
                $thoughtBox = newThoughtBox(path.slice(0, i + 1));
                $('.thoughts').append($thoughtBox);
            }
            $thoughtBox.slideDown('fast');
        }
    };

    if (promise != undefined) promise.done(after);
    else after();
}

function wordClick() {
    $thoughtBox = $(this).parent().parent().parent();
    var path = paths[$thoughtBox.data('index')].slice();
    path.push($(this).html());

    selectPath(path);
}

function sentenceToWords(sentence) {
    var words = sentence.split(' ');
    var filteredWords = [];
    words.forEach(function(word) {
        if (word.match(/[a-zA-Z]/i)) {
            filteredWords.push(word);
        }
    });
    return filteredWords;
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
    var path = paths[$thoughtBox.data('index')];
    var node = getNode(wordTree, path);

    selectPath(path);

    for (var word in node) {
        if (word != '@') {
            deleteNode(node[word]);
        }
    }

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

        node[word] = {};
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

function deleteButtonClick() {
    // i do nothing on purpose
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

function newThoughtBox(path) {
    var $thoughtBox = $(thoughtBoxTemplate);
    $thoughtBox.data('index', index);
    $thoughtBox.hide();

    var $thoughtInput = $thoughtBox.children('.thought-input-box').children('.thought-input');
    $thoughtInput.keydown(thoughtInputKeydown);
    $thoughtInput.blur(thoughtInputOnblur);

    if (path.length > 0) {
        $thoughtInput.attr('placeholder', 'What is ' + path[path.length - 1] + '?');
    } else {
        $thoughtInput.attr('placeholder', 'Clear your mind...');
    }

    var $thoughtWordsBox = $thoughtBox.children('.thought-words-box');
    $thoughtWordsBox.children('.edit-button').click(editButtonClick);
    $thoughtWordsBox.children('.delete-button').click(deleteButtonClick);

    $thoughtWordsBox.hide();

    paths[index++] = path;
    var treeNode = getNode(wordTree, path);
    treeNode['@'] = $thoughtBox;

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

    var $firstThoughtBox = newThoughtBox([]);
    $firstThoughtBox.show();
    $('.thoughts').append($firstThoughtBox);
}

$(document).ready(main);
