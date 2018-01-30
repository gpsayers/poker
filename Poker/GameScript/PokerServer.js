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

pokerHub.client.clientScore = function (winnerName) {
    newHand();
    nextPhase();
    //handScore = score;
    //console.log("Player score: " + handScore);
    winningPlayer = winnerName;
    showWinner = true;
    if (gameReady == true) {
        //Start countdown
        countDownOn = true;
        countDownVal = 3;
    }
}

pokerHub.client.playerInfo = function (playerInfo) {
    playerChips = playerInfo.chips;
}

pokerHub.client.oppInfo = function (opp) {
    if (opp != null) {
        oppChips = opp.chips;
        oppReady = opp.ready;
        oppName = opp.name;
        oppSeat = opp.tableSeat;
        oppRevealCards = opp.cardsRevealed;
        oppAllIn = opp.allin;
        oppCalled = opp.called;
        oppFolded = opp.folded;
        oppRaised = opp.raised;
    }
}

pokerHub.client.gameInfo = function (info) {
    console.log(info);
    var gameInfo = info;
    handPhase = gameInfo.handPhase;
    flopCardArray = gameInfo.cardsInPlay;
    currentPot = gameInfo.currentPot;
    gameDealer = gameInfo.dealer;
    gameReady = gameInfo.gameReady;
    gameHandInProgress = gameInfo.handInProgress;
    gameCurrentRaise = gameInfo.currentRaise;
    gamePlayerTurn = gameInfo.playerTurn;
    currentRaise = gameInfo.currentRaise;
    currentAmountToCall = gameInfo.currentAmountToCall;
    smallBlindPlayer = gameInfo.smallBlind;
    winningPlayer = gameInfo.playerWinner;
    
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

function showOppCards() {
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

function getTurn() {
    $.connection.hub.start().done(function () {
        pokerHub.server.getTurn();
    });
}

function getRiver() {
    $.connection.hub.start().done(function () {
        pokerHub.server.getRiver();
    });
}

function checkHand() {
    $.connection.hub.start().done(function () {
        pokerHub.server.checkHand();
    });
}

function playerReady(ready) {
    $.connection.hub.start().done(function () {
        pokerHub.server.playerReady(ready);
    });
}

function getGameInfo() {
    $.connection.hub.start().done(function () {
        pokerHub.server.getGameInfo();
    });
}

function playBlinds(small, big) {
    $.connection.hub.start().done(function () {
        pokerHub.server.playBlinds(small, big);
    });
}

function raise(amount) {
    $.connection.hub.start().done(function () {
        pokerHub.server.raise(amount);
    });
}

function call(amount) {
    $.connection.hub.start().done(function () {
        pokerHub.server.call(amount);
    });
}

function fold() {
    $.connection.hub.start().done(function () {
        pokerHub.server.fold();
    });
}

function nextPhase() {
    $.connection.hub.start().done(function () {
        pokerHub.server.nextPhase();
    });
}

function getPlayerInfo() {
    $.connection.hub.start().done(function () {
        pokerHub.server.getPlayerInfo();
    });
}

function getOppInfo() {
    $.connection.hub.start().done(function () {
        pokerHub.server.getOppInfo();
    });

}