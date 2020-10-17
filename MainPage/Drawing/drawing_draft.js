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
// We prob need a timer to constantly store and update the other persons array
otherBoard = []        //  <We should store the firebase thing here
// sample drawing (1 STROKE MOUSE DOWN TO MOUSE UP)
otherBoard = ["132,61,black,1602965002940", "130,63,black,1602965002955", "128,65,black,1602965002962", "125,66,black,1602965002971", "119,70,black,1602965002978", "111,75,black,1602965002988", "99,82,black,1602965003005", "88,89,black,1602965003027", "73,98,black,1602965003045", "60,107,black,1602965003060", "53,112,black,1602965003068", "42,120,black,1602965003080", "26,132,black,1602965003101", "17,140,black,1602965003116", "13,143,black,1602965003127", "10,145,black,1602965003139", "8,147,black,1602965003197", "8,147,black,1602965003266", "9,147,black,1602965003272", "10,147,black,1602965003278", "11,147,black,1602965003287", "13,146,black,1602965003292", "15,146,black,1602965003298", "19,146,black,1602965003346", "81,135,black,1602965003376", "89,133,black,1602965003383", "97,132,black,1602965003391", "102,130,black,1602965003397", "108,129,black,1602965003405", "111,128,black,1602965003410", "115,127,black,1602965003418", "120,125,black,1602965003425", "123,124,black,1602965003437", "137,120,black,1602965003460", "147,118,black,1602965003488", "153,117,black,1602965003506", "161,115,black,1602965003546", "168,114,black,1602965003561", "170,114,black,1602965003568", "171,114,black,1602965003578", "172,114,black,1602965003583", "173,114,black,1602965003591", "175,114,black,1602965003598", "176,113,black,1602965003606", "177,113,black,1602965003613", "180,113,black,1602965003621", "181,112,black,1602965003627", "183,112,black,1602965003637", "185,111,black,1602965003643", "186,111,black,1602965003648", "188,111,black,1602965003659", "190,110,black,1602965003667", "191,110,black,1602965003674", "191,110,black,1602965003686", "189,114,black,1602965003798", "185,118,black,1602965003817", "180,124,black,1602965003828", "166,137,black,1602965003847", "148,152,black,1602965003864", "135,165,black,1602965003876", "112,185,black,1602965003904", "99,195,black,1602965003910", "93,199,black,1602965003918", "84,205,black,1602965003926", "79,209,black,1602965003933", "74,213,black,1602965003941", "71,215,black,1602965003947", "68,217,black,1602965003956", "67,218,black,1602965003964", "66,219,black,1602965003973", "65,219,black,1602965004042", "66,219,black,1602965004050", "68,218,black,1602965004058", "70,217,black,1602965004064", "75,214,black,1602965004074", "80,212,black,1602965004081", "90,207,black,1602965004089", "99,204,black,1602965004095", "110,199,black,1602965004101", "125,193,black,1602965004109", "139,188,black,1602965004116", "162,178,black,1602965004124", "176,174,black,1602965004130", "198,166,black,1602965004141", "211,162,black,1602965004147", "230,156,black,1602965004157", "244,152,black,1602965004165", "253,150,black,1602965004173", "259,149,black,1602965004179", "263,148,black,1602965004188", "264,148,black,1602965004194", "264,149,black,1602965004248", "264,150,black,1602965004256", "263,151,black,1602965004264", "256,160,black,1602965004285", "250,167,black,1602965004292", "244,175,black,1602965004299", "235,186,black,1602965004307", "225,199,black,1602965004315", "211,219,black,1602965004326"]
// EX: repeat every 5 seconds updateDrawingBoard(otherArr)

    
function init() {
    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;

    canvas.addEventListener("mousemove", function (e) {
        updateDrawingBoard(otherBoard)
        findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        
        findxy('up', e)
        // SEND ARRAY TO FIREBASE -> scroll down to another place were we have to store into firebase -------------------------------------
        firebase_arr = [];
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
        // SEND ARRAY TO FIREBASE HERE -------------------------------------
        firebase_arr = [];
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

            // SEND ARRAY TO FIREBASE -------------------------------------
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
                console.log(firebase_arr)
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
        if (i == 0 && board.length == 1) {
            // CREATES A DOT
            ctx.beginPath();
            ctx.fillStyle = tempColorc;
            ctx.fillRect(tempXc, tempYc, 2, 2);
            ctx.closePath();
        } else {
            if (i != 0) {
                updateDraw(tempXp, tempYp, tempXc, tempYc, tempColorc)
            }
        }
        tempXp = tempXc;
        tempYp = tempYc;
        tempColorp = tempColorc;
        tempTimep = tempTimec;
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


