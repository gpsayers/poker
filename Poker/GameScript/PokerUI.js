$("#stand").click(function() {
    playerStand();
    getSeats();
});

//temporary button
$("#deal").click(function () {
    dealCards();
    getPhase();

});

//temporary button
$("#flop").click(function () {
    dealFlop();
    getPhase();    
});

$("#reveal").click(function () {

    revealHand(true);

});