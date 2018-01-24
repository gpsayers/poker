canvas.addEventListener('mouseup',
    function(event) {
        var mousePos = getMousePos(canvas, event);

        //Click on join table button
        if (mousePos.x > 280 && mousePos.x < 440 && mousePos.y > 420 && mousePos.y < 460) {
            if (seatsList.length < 2) {
                playerSit();
                getSeats();
                showOpp();
            }
        }

    });

canvas.addEventListener("touchend", function (e) {
    var mouseEvent = new MouseEvent("mouseup", {});
    canvas.dispatchEvent(mouseEvent);
}, false);


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}



$("#stand").click(function () {
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

$("#ready").click(function () {
    readyFlag = !readyFlag;
    console.log(readyFlag);
});

$("#turn").click(function () {
    getTurn();
});

$("#river").click(function () {
    getRiver();
});


$("#message").keyup(function (event) {
    if (event.keyCode === 13) {
        $('#send').click();
    }
});

$("#check").click(function () {
    checkHand();
});