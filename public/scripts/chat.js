$(function() {
    var FADE_TIME_MS = 150;

    var $window = $(window);
    var $messages = $('.messages');
    var $inputMessage = $('.inputMessage');

    var socket = io();

    function cleanInput(input) {
        return $('<div/>').text(input).text();
    }

    function sendMessage() {
        var message = $inputMessage.val();
        message = cleanInput(message);

        if (message) {
            $inputMessage.val('');
            socket.emit('new message', message);
        }
    }

    function addChatMessage(data) {
        var $usernameDiv = $('<span class="username"/>')
            .text(data.username)
            .css('color', 'black');
        var $messageBodyDiv = $('<span class="messageBody">')
            .text(data.message);

        var $messageDiv = $('<li class="message"/>')
            .append($usernameDiv, $messageBodyDiv);

        $messageDiv.hide().fadeIn(FADE_TIME_MS);
        $messages.append($messageDiv);
        $messages[0].scrollTop = $messages[0].scrollHeight;
    }

    $window.keydown(function (event) {
        if (!(event.ctrlKey || event.metaKey || event.altKey)) {
            $inputMessage.focus();
        }

        if (event.which === 13) {
            sendMessage();
        }
    });

    $inputMessage.click(function() {
        $inputMessage.focus();
    });

    // socket events
    socket.on('new message', function (data) {
        addChatMessage(data);
    });
});
