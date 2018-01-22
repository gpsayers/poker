// Declare a proxy to reference the hub.
var pokerHub = $.connection.pokerServer;

//Client functions
pokerHub.client.clientPlayerList = function (players) {
    playerList = players;
}

pokerHub.client.clientMessage = function (message) {
    console.log(message);
}

pokerHub.client.clientSeats = function (seats) {
    seatsList = seats;
}

pokerHub.client.chatMessage = function (chatMessage, name) {
    var encodedName = $('<div />').text(name).html();
    var encodedMsg = $('<div />').text(chatMessage).html();
    // Add the message to the page. 
    $('#discussion').append('<li><strong>' + encodedName
        + '</strong>:&nbsp;&nbsp;' + encodedMsg + '</li>');

    var element = document.getElementById("scroll");
    element.scrollTop = element.scrollHeight;
}

//Start the connection and wait for triggers
$.connection.hub.start().done(function () {


    $('#send').click(function () {

        pokerHub.server.send($("#message").val(), currentPlayer);

        $("#message").val("");
    });


});

function addPlayer(player) {
    $.connection.hub.start().done(function () {
        pokerHub.server.addPlayer(player);
    });
}


function getSeats() {
    $.connection.hub.start().done(function () {
        pokerHub.server.getSeatsList();
    });
}

function playerSit() {
    $.connection.hub.start().done(function () {
        pokerHub.server.playerSit();
    });
}