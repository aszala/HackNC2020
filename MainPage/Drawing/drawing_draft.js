var firebase_arr = [];
var update_counter = 0;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var initDate = new Date() // update board after a certain time interval with % division

var canvas, ctx, flag = false,
        prevX = 0,
        currX = 0,
        prevY = 0,
        currY = 0,
        dot_flag = false;

var x = "black",
y = 2;
// We prob need a timer to constantly store and update the other persons array
otherBoard = []        //  <We should store the firebase thing here
// sample drawing (1 STROKE MOUSE DOWN TO MOUSE UP)
// EX: repeat every 5 seconds updateDrawingBoard(otherArr)

// testing firebase
thisCollection = "DrawingTest";
thisPerson = "User2_Donkey";
otherPerson = "User1_Shrek"

function init() {
    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;

    canvas.addEventListener("mousemove", function (e) {
        var date = new Date();
        if ((date.getTime() - initDate.getTime()) % 300 == 0) {
            otherboard = getFromFirebase(otherUser);        // GET OTHER PERSONS ARRAY FROM THEIR ACC
            updateDrawingBoard(otherBoard, currUser)        // UPDATE DRAWING BOARD
        }
        findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
        if (firebase_arr.length > 0) {
            // SEND ARRAY TO FIREBASE -> scroll down to another place were we have to store into firebase -------------------------------------
            storeToFirebase(firebase_arr);
            firebase_arr = [];
        }
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
        // SEND ARRAY TO FIREBASE HERE -------------------------------------
        if (firebase_arr.length > 0) {
            storeToFirebase(firebase_arr, currUser);;
            firebase_arr = [];
        } 
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
    // console.log("firebase_arr len: " + firebase_arr.length)
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
            // console.log(firebase_arr[firebase_arr.length - 1])
            // SEND ARRAY TO FIREBASE -------------------------------------
            storeToFirebase(firebase_arr, currUser);
            firebase_arr = []
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
                // console.log(firebase_arr)
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


var tempXp = 0;
var tempYp = 0;
var tempColorp = "black";
var tempTimep = 0;

function updateDrawingBoard(board) {
    for (var i = 0; i < board.length - 1; i++) {
        var tempSplitArrc = board[i].split(',')
        var tempXc = tempSplitArrc[0]
        var tempYc = tempSplitArrc[1]
        var tempColorc = tempSplitArrc[2]
        var tempTimec = tempSplitArrc[3]    
        if (i != 0) {
            updateDraw(tempXp, tempYp, tempXc, tempYc, tempColorc)
        }
        tempXp = tempXc;
        tempYp = tempYc;
        tempColorp = tempColorc;
        tempTimep = tempTimec;
    }
    if (board.length == 1) {
        var tempSplitArrc = board[i].split(',')
        var tempXc = tempSplitArrc[0]
        var tempYc = tempSplitArrc[1]
        var tempColorc = tempSplitArrc[2]
        var tempTimec = tempSplitArrc[3] 
        // CREATES A DOT
        ctx.beginPath();
        ctx.fillStyle = tempColorc;
        ctx.fillRect(tempXc, tempYc, 2, 2);
        ctx.closePath();
    }

}

function updateDraw(pX, pY, cX, cY, cColor) {
    ctx.beginPath();
    ctx.moveTo(pX, pY);
    ctx.lineTo(cX, cY);
    ctx.strokeStyle = cColor;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
}


function storeToFirebase(thisArray, ThisUser) {
    // Store thisArray to firebase into ThisUser
    console.log("storeToFirebase");
}

function getFromFirebase(thisArray, ThisUser) {
    // get thisArray from thisUser's account on firebase and return it
    console.log("getFromFirebase");
}
