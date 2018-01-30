function Card(id, image) {
    this.id = id;
    this.image = image;
}

var Deck = [];

Deck.push(new Card(1, "Images/playingCards/2_of_spades.svg"));
Deck.push(new Card(2, "Images/playingCards/3_of_spades.svg"));
Deck.push(new Card(3, "Images/playingCards/4_of_spades.svg"));
Deck.push(new Card(4, "Images/playingCards/5_of_spades.svg"));
Deck.push(new Card(5, "Images/playingCards/6_of_spades.svg"));
Deck.push(new Card(6, "Images/playingCards/7_of_spades.svg"));
Deck.push(new Card(7, "Images/playingCards/8_of_spades.svg"));
Deck.push(new Card(8, "Images/playingCards/9_of_spades.svg"));
Deck.push(new Card(9, "Images/playingCards/10_of_spades.svg"));
Deck.push(new Card(10, "Images/playingCards/jack_of_spades.svg"));
Deck.push(new Card(11, "Images/playingCards/queen_of_spades.svg"));
Deck.push(new Card(12, "Images/playingCards/king_of_spades.svg"));
Deck.push(new Card(13, "Images/playingCards/ace_of_spades.svg"));

Deck.push(new Card(14, "Images/playingCards/2_of_hearts.svg"));
Deck.push(new Card(15, "Images/playingCards/3_of_hearts.svg"));
Deck.push(new Card(16, "Images/playingCards/4_of_hearts.svg"));
Deck.push(new Card(17, "Images/playingCards/5_of_hearts.svg"));
Deck.push(new Card(18, "Images/playingCards/6_of_hearts.svg"));
Deck.push(new Card(19, "Images/playingCards/7_of_hearts.svg"));
Deck.push(new Card(20, "Images/playingCards/8_of_hearts.svg"));
Deck.push(new Card(21, "Images/playingCards/9_of_hearts.svg"));
Deck.push(new Card(22, "Images/playingCards/10_of_hearts.svg"));
Deck.push(new Card(23, "Images/playingCards/jack_of_hearts.svg"));
Deck.push(new Card(24, "Images/playingCards/queen_of_hearts.svg"));
Deck.push(new Card(25, "Images/playingCards/king_of_hearts.svg"));
Deck.push(new Card(26, "Images/playingCards/ace_of_hearts.svg"));


Deck.push(new Card(27, "Images/playingCards/2_of_clubs.svg"));
Deck.push(new Card(28, "Images/playingCards/3_of_clubs.svg"));
Deck.push(new Card(29, "Images/playingCards/4_of_clubs.svg"));
Deck.push(new Card(30, "Images/playingCards/5_of_clubs.svg"));
Deck.push(new Card(31, "Images/playingCards/6_of_clubs.svg"));
Deck.push(new Card(32, "Images/playingCards/7_of_clubs.svg"));
Deck.push(new Card(33, "Images/playingCards/8_of_clubs.svg"));
Deck.push(new Card(34, "Images/playingCards/9_of_clubs.svg"));
Deck.push(new Card(35, "Images/playingCards/10_of_clubs.svg"));
Deck.push(new Card(36, "Images/playingCards/jack_of_clubs.svg"));
Deck.push(new Card(37, "Images/playingCards/queen_of_clubs.svg"));
Deck.push(new Card(38, "Images/playingCards/king_of_clubs.svg"));
Deck.push(new Card(39, "Images/playingCards/ace_of_clubs.svg"));


Deck.push(new Card(40, "Images/playingCards/2_of_diamonds.svg"));
Deck.push(new Card(41, "Images/playingCards/3_of_diamonds.svg"));
Deck.push(new Card(42, "Images/playingCards/4_of_diamonds.svg"));
Deck.push(new Card(43, "Images/playingCards/5_of_diamonds.svg"));
Deck.push(new Card(44, "Images/playingCards/6_of_diamonds.svg"));
Deck.push(new Card(45, "Images/playingCards/7_of_diamonds.svg"));
Deck.push(new Card(46, "Images/playingCards/8_of_diamonds.svg"));
Deck.push(new Card(47, "Images/playingCards/9_of_diamonds.svg"));
Deck.push(new Card(48, "Images/playingCards/10_of_diamonds.svg"));
Deck.push(new Card(49, "Images/playingCards/jack_of_diamonds.svg"));
Deck.push(new Card(50, "Images/playingCards/queen_of_diamonds.svg"));
Deck.push(new Card(51, "Images/playingCards/king_of_diamonds.svg"));
Deck.push(new Card(52, "Images/playingCards/ace_of_diamonds.svg"));

Deck.push(new Card(99, "Images/playingCards/back.jpg"));


var playerList,
    currentPlayer,
    seatsList = [],
    handCardArray = [],
    flopCardArray = [],
    oppCardsArray = [],
    oppChips = 0,
    oppReady = false,
    oppName = "",
    oppSeat = 0,
    oppRevealCards = false,
    oppAllIn = false,
    oppCalled = false,
    oppFolded = false,
    oppRaised = false,
    showhand = false,
    showflop = false,
    showopp = false,
    handPhase = 0,
    readyFlag = false,
    handScore = 0.0,
    playerChips = 100,
    currentPot = 0,
    betAmount = 0,
    gameReady = false,
    gameHandInProgress = false,
    gameDealer = "",
    gamePlayerTurn = "",
    gameCurrentRaise = 0,
    countDownVal = 0,
    countDownOn = false,
    smallBlind = 5,
    bigBlind = 10,
    currentRaise = 0,
    currentAmountToCall = 0,
    smallBlindPlayer = "",
    winningPlayer = "";



var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

canvas.width = 725;
canvas.height = 562;


//game loop vars
var fps = 60,
    interval = 1000 / fps,
    lastTime = (new Date()).getTime(),
    currentTime = 0,
    delta = 0,
    cycles = 0;


function gameLoop() {

    window.requestAnimationFrame(gameLoop);

    currentTime = (new Date()).getTime();
    delta = (currentTime - lastTime);

    if (delta > interval) {

        cycles++;

        lastTime = currentTime - (delta % interval);

        updatePokerTable();
       

        if (gameReady == true && gameHandInProgress == false && countDownOn == false) {
            //Start countdown
            countDownOn = true;
            countDownVal = 3;
        }

        if (countDownOn == true && countDownVal == 0)
        {
            gameHandInProgress = true;
            countDownOn = false;
            dealCards();
            playBlinds(smallBlind, bigBlind);
            getGameInfo();
            console.log("Start hand");
        }

        if ((cycles % 60) == 0) {
            getSeats();
            showOppCards();
            getGameInfo();

            if (countDownOn == true && countDownVal > 0) {
                countDownVal--;
            }
        }

    }

}

function loadPokerTable() {

        //$.getJSON('http://freegeoip.net/json/?callback=?', function (data) {
    //    var ip = data.ip;
    //});

    //playerChips = localStorage.getItem();
    playerChips = localStorage.getItem('chips');

    if (playerChips == null) {
        playerChips = 100;
        localStorage.setItem('chips', playerChips);
    }

    imgDeck = new Image();
    imgDeck.src = "Images/playingCards/back.jpg";
    imgDeck.onload = function () {
        context.drawImage(imgDeck, 25, 209,100, 144);
    }
    
    imgDealer = new Image();
    imgDealer.src = "Images/chip_dealer.png";
    imgDealer.onload = function () {
        context.drawImage(imgDealer, 200, 209, 100, 100);
    }

    imgChip1 = new Image();
    imgChip1.src = "Images/chip_white_flat.png";
    imgChip1.onload = function () {
        context.drawImage(imgChip1, 200, 209, 100, 100);
    }

    imgChip5 = new Image();
    imgChip5.src = "Images/chip_red_flat.png";
    imgChip5.onload = function () {
        context.drawImage(imgChip5, 200, 209, 100, 100);
    }
    
    imgChip10 = new Image();
    imgChip10.src = "Images/chip_blue_flat.png";
    imgChip10.onload = function () {
        context.drawImage(imgChip10, 200, 209, 100, 100);
    }
    
    $("#ready").hide();
    $("#bet").hide();
    $("#bet5").hide();
    $("#bet10").hide();
    $("#betval").hide();
    $("#fold").hide();
    $("#check").hide();
    $("#reveal").hide();
    $("#stand").hide();
    $("#pass").hide();
    $("#call").hide();
}

function updatePokerTable() {

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.clearRect(280, 420, 160, 40);

    context.fillStyle = "#45a173";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.beginPath();
    context.strokeStyle = "black";
    context.rect(1, 1, 723, 560);
    context.rect(10, 10, 245, 174);
    context.rect(265, 10, 450, 174);
    context.rect(10, 194, 705, 174);
    context.rect(10, 378, 245, 174);
    context.rect(265, 378, 450, 174);
    context.stroke();
    context.closePath();

    context.drawImage(imgDeck, 25, 209, 100, 144);
    context.drawImage(imgDeck, 23, 207, 100, 144);
    context.drawImage(imgDeck, 21, 205, 100, 144);

    if (countDownVal > 0) {
        context.beginPath();
        context.fillStyle = "black";
        context.font = "30px Arial";
        context.fillText("Game start in..... " + countDownVal, 290, 290);
        context.closePath();
    }

    if (winningPlayer != null && winningPlayer != "") {
        context.beginPath();
        context.fillStyle = "gold";
        context.font = "40px Arial";
        context.fillText(winningPlayer + " wins!", 290, 290);
        context.closePath();

    }

    if (showflop) {
        context.drawImage(imgFlopCard1, 140, 209, 100, 144);
        context.drawImage(imgFlopCard2, 255, 209, 100, 144);
        context.drawImage(imgFlopCard3, 370, 209, 100, 144);
    }

    if (handPhase > 4 && showflop == true) {
        context.drawImage(imgFlopCard4, 485, 209, 100, 144);
    }

    if (handPhase > 6 && showflop == true) {
        context.drawImage(imgFlopCard5, 600, 209, 100, 144);
    }

    if (handPhase > 8) {
        //context.beginPath();
        //context.fillStyle = "black";
        //context.font = "30px Arial";
        //context.fillText(handScore, 500, 410);
        //context.closePath();
    }

    var playerString = "";

    $.each(playerList,
        function(index, item) {
            playerString += item;
            playerString += "<br/>";
        });

    $("#currentPlayers").html(playerString);
    if ((seatsList.length > 0 && seatsList.indexOf(currentPlayer) == -1) || (seatsList.length > 1)) {
        displayOpponentArea();
    }


    if (seatsList.length < 2 && seatsList.indexOf(currentPlayer) == -1) {
        context.beginPath();
        context.fillStyle = "black";
        context.font = "30px Arial";
        context.fillText("Sit at table", 290, 472);
        //Previous rectangle button
        //context.rect(280, 420, 160, 40);
        context.arc(362.5, 465, 75, 0, 2 * Math.PI);
        context.stroke();
        context.closePath();
    } else {
        displayPlayerArea();
    }

}

function loadHand() {
    var i = 1;
    $.each(handCardArray, function (index, card) {
        var cardInfo = $.grep(Deck, function (x) {
            return x.id == card;
        })

        if (i == 1) {
            imgPlayerCard1 = new Image();
            imgPlayerCard1.src = cardInfo[0].image;
            imgPlayerCard1.onload = function () {
                context.drawImage(imgPlayerCard1, 25, 393, 100, 144);
            }
        }

        if (i == 2) {
            imgPlayerCard2 = new Image();
            imgPlayerCard2.src = cardInfo[0].image;
            imgPlayerCard2.onload = function () {
                context.drawImage(imgPlayerCard2, 140, 393, 100, 144);
            }
        }

        i++;

    });

    showhand = true;
}

function loadFlop() {
    var i = 1;
    $.each(flopCardArray, function (index, card) {
        var cardInfo = $.grep(Deck, function (x) {
            return x.id == card;
        })

        if (i == 1) {
            imgFlopCard1 = new Image();
            imgFlopCard1.src = cardInfo[0].image;
            imgFlopCard1.onload = function () {
                context.drawImage(imgFlopCard1, 140, 209, 100, 144);
            }
        }

        if (i == 2) {
            imgFlopCard2 = new Image();
            imgFlopCard2.src = cardInfo[0].image;
            imgFlopCard2.onload = function () {
                context.drawImage(imgFlopCard2, 255, 209, 100, 144);
            }
        }

        if (i == 3) {
            imgFlopCard3 = new Image();
            imgFlopCard3.src = cardInfo[0].image;
            imgFlopCard3.onload = function () {
                context.drawImage(imgFlopCard3, 370, 209, 100, 144);

            }
        }

        if (i == 4) {
            imgFlopCard4 = new Image();
            imgFlopCard4.src = cardInfo[0].image;
            imgFlopCard4.onload = function () {
                context.drawImage(imgFlopCard4, 485, 209, 100, 144);
            }
        }

        if (i == 5) {
            imgFlopCard5 = new Image();
            imgFlopCard5.src = cardInfo[0].image;
            imgFlopCard5.onload = function () {
                context.drawImage(imgFlopCard5, 600, 209, 100, 144);
            }
        }
        i++;
        
    });
    showflop = true;
}

function loadOpps() {
    var i = 1;
    $.each(oppCardsArray, function (index, card) {
        var cardInfo = $.grep(Deck, function (x) {
            return x.id == card;
        })

        if (i == 1) {
            imgOppCard1 = new Image();
            imgOppCard1.src = cardInfo[0].image;
            imgOppCard1.onload = function () {
                context.drawImage(imgOppCard1, 25, 25, 100, 144);
            }
        }

        if (i == 2) {
            imgOppCard2 = new Image();
            imgOppCard2.src = cardInfo[0].image;
            imgOppCard2.onload = function () {
                context.drawImage(imgOppCard2, 140, 25, 100, 144);
            }
        }

        i++;

    });

    showopp = true;
}

function displayPlayerArea() {
    context.beginPath();
    context.fillStyle = "black";
    context.font = "30px Arial";
    context.fillText(currentPlayer, 705 - context.measureText(currentPlayer).width, 410);

    if (gameDealer == currentPlayer) {
        context.drawImage(imgDealer, 485, 385, 50, 50);
    }

        
    var chipCalc = playerChips,
        chip1 = 0,
        chip5 = 0,
        chip10 = 0;

    while (chipCalc % 5 != 0) {
        chipCalc--;
        chip1++;
    }

    if (chipCalc >= 25) {
        while (chipCalc % 10 != 0 || chip5 < 4) {
            chipCalc = chipCalc - 5;
            chip5++;
        }
        chip10 = chipCalc / 10;
    }
    else {
        chip5 = chipCalc / 5;
    }
    
    if (chip1 == 0 && chipCalc > 0) {
        chip1 = 5;
        chip5--;
    }
    
    for (i = 0; i < chip10; i++) {
        context.drawImage(imgChip10, 570, (505 - (i * 5)), 50, 21);
    }

    for (i = 0; i < chip1; i++) {
        context.drawImage(imgChip1, 600, (525-(i*5)), 50, 21);
    }
    for (i = 0; i < chip5; i++) {
        context.drawImage(imgChip5, 540, (525 - (i * 5)), 50, 21);
    }


    var chipsText = playerChips;
    context.fillText(chipsText, 705 - context.measureText(chipsText).width, 545);
    context.fillText("Pot: " + currentPot, 275, 410);
    context.closePath();

    if (gamePlayerTurn == currentPlayer) {
        context.beginPath();
        context.strokeStyle = "#FF0000";
        context.rect(267, 380, 446, 172);
        context.stroke();
        context.strokeStyle = "black";
        context.closePath();
    }

    if (gamePlayerTurn == currentPlayer) {
        context.beginPath();
        context.fillStyle = "black";
        context.font = "30px Arial";
        context.fillText("Awaiting Action", 275, 545);
        context.closePath();
    }


    $("#ready").show();
    $("#bet").show();
    $("#fold").show();
    $("#check").show();
    $("#reveal").show();
    $("#stand").show();
    $("#bet5").show();
    $("#bet10").show();
    $("#betval").show();
    $("#pass").show();
    $("#call").show();

    if (gamePlayerTurn != currentPlayer) {
        $("#bet").prop("disabled", true);
        $("#fold").prop("disabled", true);
        $("#bet5").prop("disabled", true);
        $("#bet10").prop("disabled", true);
        $("#pass").prop("disabled", true);
        $("#call").prop("disabled", true);
    } else {
        $("#bet").prop("disabled", false);
        $("#fold").prop("disabled", false);
        $("#bet5").prop("disabled", false);
        $("#bet10").prop("disabled", false);
        $("#pass").prop("disabled", false);
        $("#call").prop("disabled", false);
    }


    if (showhand == true) {
        context.drawImage(imgPlayerCard1, 25, 393, 100, 144);
        context.drawImage(imgPlayerCard2, 140, 393, 100, 144);
    }

}

function displayOpponentArea() {

    var other = $.grep(seatsList, function (a) {
        return a != currentPlayer;
    });

    var otherPlayer = other[0];

    context.beginPath();
    context.fillStyle = "black";
    context.font = "30px Arial";
    context.fillText(otherPlayer, 705 - context.measureText(otherPlayer).width, 40);
    context.closePath();

    if (gameDealer == otherPlayer) {
        context.drawImage(imgDealer, 485, 17, 50, 50);
    }

    var chipCalc = oppChips,
        chip1 = 0,
        chip5 = 0,
        chip10 = 0;

    while (chipCalc % 5 != 0) {
        chipCalc--;
        chip1++;
    }

    if (chipCalc >= 25) {
        while (chipCalc % 10 != 0 || chip5 < 4) {
            chipCalc = chipCalc - 5;
            chip5++;
        }
        chip10 = chipCalc / 10;
    }
    else {
        chip5 = chipCalc / 5;
    }

    if (chip1 == 0 && chipCalc > 0) {
        chip1 = 5;
        chip5--;
    }

    for (i = 0; i < chip10; i++) {
        context.drawImage(imgChip10, 570, (137 - (i * 5)), 50, 21);
    }

    for (i = 0; i < chip1; i++) {
        context.drawImage(imgChip1, 600, (157 - (i * 5)), 50, 21);
    }
    for (i = 0; i < chip5; i++) {
        context.drawImage(imgChip5, 540, (157 - (i * 5)), 50, 21);
    }


    var chipsText = oppChips;
    context.fillText(chipsText, 705 - context.measureText(chipsText).width, 177);

    if (gamePlayerTurn == otherPlayer) {
        context.beginPath();
        context.strokeStyle = "#FF0000";
        context.rect(267, 12, 446, 170);
        context.stroke();
        context.strokeStyle = "black";
        context.closePath();

        context.beginPath();
        context.fillStyle = "red";
        context.font = "25px Arial";
        context.fillText("Making choices...", 275, 105);
        context.closePath();
    }
    else {
        var message = "";
        if (handPhase == 2) {
            //player is blind
            if (smallBlindPlayer == otherPlayer) {
                message = "Small blind: " + smallBlind;
            }
            else {
                message = "Big blind: " + bigBlind;
            }

        }

        if (handPhase == 4 || handPhase == 6 || handPhase == 8) {
            message = currentPlayer + " is first to act.";
        }

        if (oppRaised) {
            //otherPlayer raised X
            message = otherPlayer + " raised you " + gameCurrentRaise;
        }

        if (oppCalled) {
            message = otherPlayer + " called.";
        }

        if (oppFolded) {
            //otherPlayer folded
            message = otherPlayer + " folded.";
        }

        if (oppAllIn) {
            message = otherPlayer + " is all in!";
        }



        context.beginPath();
        context.fillStyle = "black";
        context.font = "25px Arial";
        context.fillText(message, 272, 177);
        context.closePath();
    }




    if (showopp == true && handPhase > 0) {
        context.drawImage(imgOppCard1, 25, 25, 100, 144);
        context.drawImage(imgOppCard2, 140, 25, 100, 144);
    }
}

function newHand() {

    flopCardArray.length = 0;
    handCardArray.length = 0;
    oppCardsArray.length = 0;
    oppRevealCards = false;
    oppAllIn = false;
    oppCalled = false;
    oppFolded = false;
    oppRaised = false;
    showhand = false;
    showflop = false;
    showopp = false;
    handPhase = 0;
    currentPot = 0;
    betAmount = 0;
    gameHandInProgress = false;
    gamePlayerTurn = "";
    gameCurrentRaise = 0;
    countDownVal = 0;
    countDownOn = false;
    currentRaise = 0;
    currentAmountToCall = 0;
    smallBlindPlayer = "";
    winningPlayer = "";
    showflop = false;

}

loadPokerTable();

gameLoop();
