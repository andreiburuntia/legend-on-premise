// timers in secodns for each trainig type
var bit_list = [300, 60, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 60, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 60, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 60, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 60, 420]
var box_list = [600, 60, 180, 60, 180, 60, 180, 60, 180, 60, 180, 60, 180, 60, 180, 60, 180, 60, 180, 60, 180, 60, 180, 60, 180, 480]
var fc_list = [600, 60, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 120, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 120, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 120, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 120, 420]

var used_list = fc_list;
var cnt = 0;

fc_list.reduce((a, b) => a + b, 0)/60

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    // add fetching of current workout in order to be saved to db later
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/workout/start",        
        success:function(data)
        {
            console.log(data);
        }
    });


    refreshId = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            cnt += 1;
            console.log(cnt);
            //display.style.display = 'none'; 
            clearInterval(refreshId);
            console.log(used_list[cnt])
            if(cnt < used_list.length - 1)
                startTimer(used_list[cnt]-1, document.querySelector('#time'));
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
                document.querySelector('#time').innerHTML = "WELL DONE!";
            }
        }
    }, 1000);
}

window.onload = function () {
    document.querySelector('#time').innerHTML = "START";
};

document.querySelector('#time').onclick = function () {
    console.log('CLICKED');
    var fiveMinutes = used_list[0]-1,//120 * 10,
    display = document.querySelector('#time');
    startTimer(fiveMinutes, display);
    
    
    const Http = new XMLHttpRequest();
    const url='http://localhost:4800/play?p=pass';
    Http.open("GET", url);
    Http.send();
    
    Http.onreadystatechange = (e) => {
      console.log(Http.responseText)
    }
    
    
    document.getElementById('vid').play();
};

setInterval(function()
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
}, 1500);