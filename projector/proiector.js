var bit_list = [300, 60, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 60, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 60, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 60, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 60, 420]
var box_list = [600, 60, 180, 60, 180, 60, 180, 60, 180, 60, 180, 60, 180, 60, 180, 60, 180, 60, 180, 60, 180, 60, 180, 60, 180, 480]
var fc_list = [600, 60, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 120, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 120, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 120, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 120, 420]

var used_list = fc_list;
var cnt = 0;

fc_list.reduce((a, b) => a + b, 0)/60

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
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
            else
                document.querySelector('#time').innerHTML = "WELL DONE!";
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
        url: "http://ec2-18-217-1-165.us-east-2.compute.amazonaws.com/proiector",
        success:function(data)
        {
            // console.log the response
            //console.log(data);
            //console.log(data)
            let resp = data.replace(/\'/g, '\"');
            //console.log(resp);
            var array = JSON.parse(resp);
            //console.log(array);
            names = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']
            i=0
            for(const element of array) {
                var bagId = 'bag-' + element['bag_id'];
                $('#'+bagId).find('.score').text(element['score']);
                //$('#'+bagId).find('.score').text('0');
                $('#'+bagId).find('.hr').text(element['hr']);
                $('#'+bagId).find('.count').text(element['count']);
                //$('#'+bagId).find('.count').text('0');
                $('#'+bagId).find('.nickname').text('USER'+element['bag_id']);
                $('#'+bagId).find('.nickname').text(names[i]);
                i++;
                /*if(element['effort'] == 1) {
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