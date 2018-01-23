$("#stand").click(function() {
    playerStand();
    getSeats();
});

//temporary button
$("#deal").click(function () {
    dealCards();

});

//temporary button
$("#flop").click(function () {
    dealFlop();

});

$("#reveal").click(function () {
    var reveal = !reveal;

    revealHand(reveal);

});