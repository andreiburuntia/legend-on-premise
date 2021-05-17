// timers in secodns for each trainig type
//BIT
var bit_list = [300, 60, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 60, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 60, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 60, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 60, 420]
//BOX
var box_list = [600, 60, 180, 60, 180, 60, 180, 60, 180, 60, 180, 60, 180, 60, 180, 60, 180, 60, 180, 60, 180, 60, 180, 60, 180, 480]
//S&C
var fc_list = [600, 60, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 120, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 120, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 120, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 120, 420]

var quotes_list = [
    "PUSH YOURSELF BECAUSE NO ONE IS GOING TO DO IT FOR YOU<br>🔥",
    "HEROES COME AND GO, LEGENDS ARE FOREVER<br>🙌",
    "FEARLESS & FABULOUS<br>🦁🤩",
    "FIGHT LIKE A GIRL<br>👗",
    "CONFIDENCE HAS NO COMPETITION<br>💪🏻",
    "I'M HERE TO KICK ASS AND CHEW BUBBLEGUM AND I'M ALL OUT OF BUBBLEGUM<br>🎀"
];

var used_list = [];
var cnt = 0;

var stopperTimeout;

bit_list.reduce((a, b) => a + b, 0)/60;
box_list.reduce((a, b) => a + b, 0)/60;
fc_list.reduce((a, b) => a + b, 0)/60;

function startTimer() {
    // add fetching of current workout in order to be saved to db later
    var timer = (used_list[cnt]-1), minutes, seconds;
    
    refreshId = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        $('#time').html ( minutes + ":" + seconds);

        if (--timer < 0) {
            cnt += 1;
            console.log("Count:" + cnt);
            clearInterval(refreshId);
            console.log("Interval value:" + used_list[cnt])
            if(cnt < used_list.length - 1){
                startTimer();
                $('#motivational-quote').html(quotes_list[Math.floor(Math.random() * quotes_list.length)]);
            }
            else {
                // add fetching of current workout in order to be saved to db later
                $.ajax({
                    type: "GET",
                    url: "http://localhost:3000/workout/finish",        
                    success:function(data)
                    {
                        console.log(data);
                    }
                });                             
                $('#time').html("WELL DONE!");

                stopperTimeout = setTimeout(function(){stopProjectorFetching(); }, 300000);

            }
        }
    }, 1000);

}

function stopProjectorFetching() {
    console.log('Kill projector fetcher');
    clearInterval(projectorRefreshInterval)    
    clearTimeout(stopperTimeout);
}

$(document).ready(function() {
    $('#motivational-quote').html(quotes_list[Math.floor(Math.random() * quotes_list.length)]);

    $('#time').html("START");

    $('#time').click(function() {

    $.ajax({
        type: "GET",
        url: "http://localhost:3000/workout/start",        
        success:function(data)
        {
            console.log('Workout start');
            if(data.w_type == "BOX") {
                $("#class-area"). text("BOX");
                used_list = box_list;
            }
            if(data.w_type == "BIT") {
                $("#class-area"). text("BOXING INTERVAL TRAINING");
                used_list = bit_list;
            }
            if(data.w_type == "S&C") {
                $("#class-area"). text("FIGHT CONDITIONING");
                used_list = fc_list;                
            }

        startTimer();
        }
    });

                
        const Http = new XMLHttpRequest();
        const url='http://localhost:4800/play?p=pass';
        Http.open("GET", url);
        Http.send();
        
        Http.onreadystatechange = (e) => {
          console.log(Http.responseText)
        }
        
        //$('#vid').get(0).play();
    });

    projectorRefreshInterval = setInterval(function()
    {
        $.ajax({
            type: "get",
            //url: "http://ec2-18-217-1-165.us-east-2.compute.amazonaws.com/proiector",
            url: "http://localhost:3000/workout/projector",        
            success:function(data)
            {
                i=0;
                for(const element of data) {
                    var bagId = 'bag-' + element['bag_id'];
                    
                    $('#'+bagId).removeClass( "grayout" );

                    $('#'+bagId).find('.score').text(element['score']);
                    //$('#'+bagId).find('.score').text('0');
                    $('#'+bagId).find('.hr').text(element['hr']);
                    //$('#'+bagId).find('.count').text(element['count']);
                    $('#'+bagId).find('.cal').text(element['count']);
                    //$('#'+bagId).find('.count').text('0');
                    // $('#'+bagId).find('.nickname').text('USER'+element['bag_id']);
                    // $('#'+bagId).find('.nickname').text(names[i]);
                    i++;
                    /*if(element['effort'] == 1) {;
                        $('#'+bagId).find('.bag-icon-border').css('background-color', 'greenyellow');
                    }
                    if(element['effort'] == 2) {
                        $('#'+bagId).find('.bag-icon-border').css('background-color', 'yellow');
                    }
                    if(element['effort'] == 3) {
                        $('#'+bagId).find('.bag-icon-border').css('background-color', 'red');
                    }*/
                }
            }
        });
    }, 1000);
});
