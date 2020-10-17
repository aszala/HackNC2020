var firebase_arr = [];
var update_counter = 0;
var canvas, ctx, flag = false,
        prevX = 0,
        currX = 0,
        prevY = 0,
        currY = 0,
        dot_flag = false;

var x = "black",
y = 2;
    
function init() {
    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;

    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);
}
    
function color(obj) {
    switch (obj.id) {
        case "green":
            x = "green";
            break;
        case "blue":
            x = "blue";
            break;
        case "red":
            x = "red";
            break;
        case "yellow":
            x = "yellow";
            break;
        case "orange":
            x = "orange";
            break;
        case "black":
            x = "black";
            break;
        // case "white":
        //     x = "white";
        //     break;
    }
    // if (x == "white") y = 14;
    // else y = 2;

}
    
function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
}
// "x,y,green"
function erase() {
    ctx.clearRect(0, 0, w, h);
    document.getElementById("canvasimg").style.display = "none";
    firebase_arr = []
    console.log("firebase_arr len: " + firebase_arr.length)
}

function findxy(res, e) {
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            var d = new Date();
            firebase_arr.push(currX + "," + currY + "," + x + "," + d.getTime())
            console.log(firebase_arr[firebase_arr.length - 1])
            update_counter = (update_counter + 1 % 3)
            ctx.beginPath();
            ctx.fillStyle = x;
            ctx.fillRect(currX, currY, 2, 2);
            ctx.closePath();
            dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        flag = false;
    }
    if (res == 'move') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            if (update_counter % 3 == 0) {
                var d = new Date();
                firebase_arr.push(currX + "," + currY + "," + x + "," + d.getTime())
                console.log(firebase_arr[firebase_arr.length - 1])
            }
            update_counter = (update_counter + 1 % 3)
            draw();
        }
    }
}

function save() {
    document.getElementById("canvasimg").style.border = "2px solid";
    var dataURL = canvas.toDataURL();
    document.getElementById("canvasimg").src = dataURL;
    console.log(document.getElementById("canvasimg").src)

    document.getElementById("canvasimg").style.display = "inline";
}


// TAKE IN THE OTHER PERSONS ARRAY AND CREATE A NEW DRAWING OR UPDATE THE CANVAS CANVAS