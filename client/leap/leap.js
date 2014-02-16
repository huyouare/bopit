bopit = angular.module('bopitApp')
.controller("LeapCtrl", function(bopitSock, bopitAudio) {
    leap = new Leap.Controller();

    var normalFlag = false;
    return leap.loop(function(frame){
        if(frame.hands.length > 0) {
            var hand = frame.hands[0];

            if(hand.pitch() < -0.2) {
                if(normalFlag){
                    bopitSock.emit("point", "Twist it!");
                    bopitAudio.twist.play();
                    $('#toyStripes').animate({ "margin-top": "-=60px" }, "fast" );
                    $('#toyStripes').animate({ "margin-top": "+=60px" }, "fast" );
                }
                normalFlag = false;
            } else if(hand.stabilizedPalmPosition[0] > 100) {
                if(normalFlag){
                    bopitSock.emit("point", "Pull it!");
                    bopitAudio.pull.play();
                    $('#toyPull').animate({ "margin-left": "+=60px" }, "fast" );
                    $('#toyPull').animate({ "margin-left": "-=60px" }, "fast" );
                }
                normalFlag = false;
            } else if(Math.abs(hand.stabilizedPalmPosition[0]) < 30 && hand.stabilizedPalmPosition[2] < -10) {
                if(normalFlag){
                    bopitSock.emit("point", "Bop it!");
                    bopitAudio.bop.play();
                    var toyBop = $('#toyBop');
                    toyBop.animate({ "margin-left": "+=35px", "margin-top": "+=10px", "height": "-=20px" }, "fast") ;
                    toyBop.animate({ "margin-left": "-=35px", "margin-top": "-=10px", "height": "+=20px" }, "fast") ;
                }
                normalFlag = false;
            } else if(Math.abs(hand.stabilizedPalmPosition[0]) < 30 &&
                    hand.stabilizedPalmPosition[2] > -20 &&
                    hand.stabilizedPalmPosition[2] < 60) {
                normalFlag = true;
            }
        }
    });
});
