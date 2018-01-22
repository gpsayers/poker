function Card(id, name, suite, description, value, image) {
    this.id = id;
    this.name = name;
    this.suite = suite;
    this.description = description;
    this.value = value;
    this.image = image;
}

function Coords(x, y) {
    this.x = x;
    this.y = y;
}


function Sprite(id, name, location, grid, visible) {
    this.id = id;
    this.name = name;
    this.location = location;
    this.grid = grid;
    this.visible = visible;
}

var Deck = [];



Deck.push(new Card(1, "Ace", "Hearts", "Ace of Hearts", 1, "Images/playingCards/ace_of_hearts.svg"));
Deck.push(new Card(2, "Two", "Hearts", "Two of Hearts", 2, "Images/playingCards/2_of_hearts.svg"));
Deck.push(new Card(3, "Three", "Hearts", "Three of Hearts", 3, "Images/playingCards/3_of_hearts.svg"));
Deck.push(new Card(4, "Four", "Hearts", "Four of Hearts", 4, "Images/playingCards/4_of_hearts.svg"));
Deck.push(new Card(5, "Five", "Hearts", "Five of Hearts", 5, "Images/playingCards/5_of_hearts.svg"));
Deck.push(new Card(6, "Six", "Hearts", "Six of Hearts", 6, "Images/playingCards/6_of_hearts.svg"));
Deck.push(new Card(7, "Seven", "Hearts", "Seven of Hearts", 7, "Images/playingCards/7_of_hearts.svg"));
Deck.push(new Card(8, "Eight", "Hearts", "Eight of Hearts", 8, "Images/playingCards/8_of_hearts.svg"));
Deck.push(new Card(9, "Nine", "Hearts", "Nine of Hearts", 9, "Images/playingCards/9_of_hearts.svg"));
Deck.push(new Card(10, "Ten", "Hearts", "Ten of Hearts", 10, "Images/playingCards/10_of_hearts.svg"));
Deck.push(new Card(11, "Jack", "Hearts", "Jack of Hearts", 11, "Images/playingCards/jack_of_hearts.svg"));
Deck.push(new Card(12, "Queen", "Hearts", "Queen of Hearts", 12, "Images/playingCards/queen_of_hearts.svg"));
Deck.push(new Card(13, "King", "Hearts", "King of Hearts", 13, "Images/playingCards/king_of_hearts.svg"));
Deck.push(new Card(14, "Ace", "Spades", "Ace of Spades", 1, "Images/playingCards/ace_of_spades.svg"));
Deck.push(new Card(15, "Two", "Spades", "Two of Spades", 2, "Images/playingCards/2_of_spades.svg"));
Deck.push(new Card(16, "Three", "Spades", "Three of Spades", 3, "Images/playingCards/3_of_spades.svg"));
Deck.push(new Card(17, "Four", "Spades", "Four of Spades", 4, "Images/playingCards/4_of_spades.svg"));
Deck.push(new Card(18, "Five", "Spades", "Five of Spades", 5, "Images/playingCards/5_of_spades.svg"));
Deck.push(new Card(19, "Six", "Spades", "Six of Spades", 6, "Images/playingCards/6_of_spades.svg"));
Deck.push(new Card(20, "Seven", "Spades", "Seven of Spades", 7, "Images/playingCards/7_of_spades.svg"));
Deck.push(new Card(21, "Eight", "Spades", "Eight of Spades", 8, "Images/playingCards/8_of_spades.svg"));
Deck.push(new Card(22, "Nine", "Spades", "Nine of Spades", 9, "Images/playingCards/9_of_spades.svg"));
Deck.push(new Card(23, "Ten", "Spades", "Ten of Spades", 10, "Images/playingCards/10_of_spades.svg"));
Deck.push(new Card(24, "Jack", "Spades", "Jack of Spades", 11, "Images/playingCards/jack_of_spades.svg"));
Deck.push(new Card(25, "Queen", "Spades", "Queen of Spades", 12, "Images/playingCards/queen_of_spades.svg"));
Deck.push(new Card(26, "King", "Spades", "King of Spades", 13, "Images/playingCards/king_of_spades.svg"));


function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

shuffle(Deck);

var newDeck;



var playerList,
    currentPlayer,
    seatsList = [],
    cycles = 0

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

canvas.width = 725;
canvas.height = 562;

canvas.addEventListener('mouseup', function (event) {
    var mousePos = getMousePos(canvas, event);

    if (mousePos.x > 280 && mousePos.x < 440 && mousePos.y > 420 && mousePos.y < 460) {
        if (seatsList.length < 2) {
            playerSit();
            console.log(seatsList);
        }
    }

})

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

var fps = 60,
    interval = 1000 / fps,
    lastTime = (new Date()).getTime(),
    currentTime = 0,
    delta = 0;

function gameLoop() {

    window.requestAnimationFrame(gameLoop);

    currentTime = (new Date()).getTime();
    delta = (currentTime - lastTime);

    if (delta > interval) {

        cycles++;

        lastTime = currentTime - (delta % interval);

        updatePokerTable();

        if ((cycles % 60) == 0) {
            getSeats();
            console.log(seatsList);
            console.log(seatsList.indexOf(currentPlayer));
        }

    }

}

function loadPokerTable() {
    imgDeck = new Image();
    imgDeck.src = "Images/playingCards/back.png";
    imgDeck.onload = function () {
        context.drawImage(imgDeck, 25, 209,100, 144);
    }

    $("#ready").hide();
    $("#bet").hide();
    $("#fold").hide();
    $("#check").hide();
    $("#reveal").hide();
    $("#stand").hide();

}



function updatePokerTable() {

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.clearRect(280, 420, 160, 40);

    context.fillStyle = "#45a173";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.beginPath();
    context.rect(1, 1, 723, 560);
    context.rect(10, 10, 705, 174);
    context.rect(10, 194, 705, 174);
    context.rect(10, 378, 705, 174);
    context.rect(25, 209, 100, 144);
    context.stroke();
    context.closePath();


    context.drawImage(imgDeck, 25, 209, 100, 144);


    var playerString = "";

    $.each(playerList,
        function(index, item) {
            playerString += item;
            playerString += "<br/>";
        });

    $("#currentPlayers").html(playerString);

    if (seatsList.length < 2 && seatsList.indexOf(currentPlayer) == -1) {

        context.beginPath();
        context.fillStyle = "black";
        context.font = "30px Arial";
        context.fillText("Sit at table", 290, 450);
        context.rect(280, 420, 160, 40);
        context.stroke();
        context.closePath();
    } else {
        displayPlayerArea();
    }

}

function dealHand() {

    newDeck = JSON.parse(JSON.stringify(Deck));

    //burn a card
    newDeck.pop();

    //Need to get player cards from server.
    var card1 = newDeck.pop();
    var card2 = newDeck.pop();
    var flop1 = newDeck.pop();
    var flop2 = newDeck.pop();
    var flop3 = newDeck.pop();

    imgOppCard1 = new Image();
    imgOppCard1.src = "Images/playingCards/back.png";
    imgOppCard1.onload = function () {
        context.drawImage(imgOppCard1, 25, 25, 100, 144);
    }

    imgOppCard2 = new Image();
    imgOppCard2.src = "Images/playingCards/back.png";
    imgOppCard2.onload = function () {
        context.drawImage(imgOppCard2, 140, 25, 100, 144);
    }

    imgPlayerCard1 = new Image();
    imgPlayerCard1.src = card1.image;
    imgPlayerCard1.onload = function () {
        context.drawImage(imgPlayerCard1, 25, 393, 100, 144);
    }

    imgPlayerCard2 = new Image();
    imgPlayerCard2.src = card2.image;
    imgPlayerCard2.onload = function () {
        context.drawImage(imgPlayerCard2, 140, 393, 100, 144);
    }

    imgFlopCard1 = new Image();
    imgFlopCard1.src = flop1.image;
    imgFlopCard1.onload = function () {
        context.drawImage(imgFlopCard1, 140, 209, 100, 144);
    }

    imgFlopCard2 = new Image();
    imgFlopCard2.src = flop2.image;
    imgFlopCard2.onload = function () {
        context.drawImage(imgFlopCard2, 255, 209, 100, 144);
    }

    imgFlopCard3 = new Image();
    imgFlopCard3.src = flop3.image;
    imgFlopCard3.onload = function () {
        context.drawImage(imgFlopCard3, 370, 209, 100, 144);
        //context.drawImage(imgFlopCard3, 485, 209, 100, 144);
        //context.drawImage(imgFlopCard3, 600, 209, 100, 144);
    }
}

function displayPlayerArea() {
    context.beginPath();
    context.fillStyle = "black";
    context.font = "30px Arial";
    context.fillText(currentPlayer, 600, 410);
    context.closePath();

    $("#ready").show();
    $("#bet").show();
    $("#fold").show();
    $("#check").show();
    $("#reveal").show();
    $("#stand").show();


}

loadPokerTable();
gameLoop();