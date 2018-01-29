canvas.addEventListener('mouseup',
    function(event) {
        var mousePos = getMousePos(canvas, event);

        //Click on join table button
        //if (mousePos.x > 280 && mousePos.x < 440 && mousePos.y > 420 && mousePos.y < 460) {
        //    if (seatsList.length < 2) {
        //        playerSit();
        //        getSeats();
        //        showOpp();
        //    }
        //}
        var circle = {
            x: 362.5,
            y: 465,
            radius: 75
        }

        //Click on join table circle
        if (isIntersect(mousePos,circle)) {
            playerSit();
            getSeats();
            showOppCards();
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

function isIntersect(point, circle) {
    return Math.sqrt((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2) < circle.radius;
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
    if (readyFlag === true) {
        $("#ready").removeClass('btn').addClass('btn btn-success');
    } else {
        $("#ready").removeClass("btn btn-success").addClass('btn');
    }
    playerReady(readyFlag);
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

$("#bet").click(function () {

    betAmount = $("#betval").val();
    if (parseInt(betAmount) > playerChips) {
        //Not a valid amount
        bootbox.alert("Not enough chips.")
    }
    else {
        raise(betAmount);
        playerChips = playerChips - betAmount;
        currentPot = parseInt(currentPot) + parseInt(betAmount);
    }

});

$("#bet5").click(function () {
    betAmount = currentAmountToCall + 5;
    if (betAmount > playerChips) {
        //Not a valid amount
        bootbox.alert("Not enough chips.");
    }
    else {
        raise(betAmount);
        playerChips = playerChips - betAmount;
        currentPot = parseInt(currentPot) + parseInt(betAmount);
    }
});

$("#bet10").click(function () {
    betAmount = currentAmountToCall + 10;
    if (betAmount > playerChips) {
        //Not a valid amount
        bootbox.alert("Not enough chips.");
    }
    else {
        raise(betAmount);
        playerChips = playerChips - betAmount;
        currentPot = parseInt(currentPot) + parseInt(betAmount);
    }
});

$("#fold").click(function () {
    //fold the hand
    fold();

});

$("#pass").click(function () {
    //pass the current round of betting
    //May only pass if current raise is 0
    if (currentAmountToCall > 0) {
        bootbox.alert("Must call or raise to continue.");
    }
    else {
        call(0);
        if (oppCalled == true || oppRaised == true) {
            nextPhase();
        }
    }

});

$("#call").click(function () {
    if (playerChips < currentAmountToCall) {
        //all in
        call(playerChips);
    }
    else {
        call(currentAmountToCall);
    }
    if (oppCalled == true || oppRaised == true) {
        nextPhase();
    }
});
