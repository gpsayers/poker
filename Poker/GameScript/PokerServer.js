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

pokerHub.client.clientHand = function (cards) {
    handCardArray = cards;
    loadHand();
}

pokerHub.client.clientFlop = function (cards) {
    flopCardArray = cards;
    loadFlop();
}

pokerHub.client.oppCards = function (cards) {
    oppCardsArray = cards;
    loadOpps();
}

pokerHub.client.dealAll = function () {
    flopCardArray.length = 0;
    showflop = false;
    getHand();
}

pokerHub.client.clientPhase = function (phase) {
    handPhase = phase;
    
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

function playerStand() {
    $.connection.hub.start().done(function () {
        pokerHub.server.playerStand();
    });
}

function dealCards() {
    $.connection.hub.start().done(function () {
        pokerHub.server.deal();
    });
}

function getHand() {
    $.connection.hub.start().done(function () {
        pokerHub.server.getHand();
    });
}

function dealFlop() {
    $.connection.hub.start().done(function () {
        pokerHub.server.getFlop();
    });
}

function showOpp() {
    $.connection.hub.start().done(function () {
        pokerHub.server.showOpp();
    });
}

function revealHand(value) {
    $.connection.hub.start().done(function () {
        pokerHub.server.revealHand(value);
    });

}

function getPhase() {
    $.connection.hub.start().done(function () {
        pokerHub.server.getPhase();
    });
}
