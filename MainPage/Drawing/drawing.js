var firebase_arr = [];
var update_counter = 0;
var storeToFirebaseCounter = 0;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var initDate = new Date() // update board after a certain time interval with % division

$('main').append(
    `<a class="action-button primary-background white fade" href='../chat/chat.html${queryString}'><i class="fas fa-chevron-left"></i></a>`
)

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

var thisCollection = "Drawing";  // I don't think this needs to change, since we store all users drawings in here
var thisPerson;
var otherPerson;
var thisPersonDocName;
var otherPersonDocName;

// TESTING
// thisPerson = "User2"
// otherPerson = "User1"
// thisPersonDocName = thisPerson + "TO" + otherPerson;
// otherPersonDocName = otherPerson + "TO" + thisPerson;

// db.collection(thisCollection).doc(thisPersonDocName).get().then((docSnapshot) => {
//     if (!docSnapshot.exists) {
//         db.collection(thisCollection).doc(thisPersonDocName).set({
//             drawing: []
//         })
//         db.collection(thisCollection).doc(otherPersonDocName).set({
//             drawing: []
//         })
//     }
// });  


let idsSaved = true;

// get the individual user ID's
auth.onAuthStateChanged((user) => {
    if (user) {
        thisPerson = auth.currentUser.uid;
        otherPerson = urlParams.get("id");
        thisPersonDocName = thisPerson + "TO" + otherPerson;
        otherPersonDocName = otherPerson + "TO" + thisPerson;
        // initilaizes the unique document/drawing log if they do not already exist
        db.collection(thisCollection).doc(thisPersonDocName).get().then((docSnapshot) => {
            if (!docSnapshot.exists) {
                db.collection(thisCollection).doc(thisPersonDocName).set({
                    drawing: []
                })
                db.collection(thisCollection).doc(otherPersonDocName).set({
                    drawing: []
                })
            }
        });
        idsSaved = true;
    } else {
        document.location.replace("/login.html");
    }
});



function init() {
    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth / 100 * 80 - 36;
    w = canvas.width;
    h = canvas.height;

    canvas.addEventListener("mousemove", function (e) {
        if (idsSaved) {
            findxy('move', e)
            var date = new Date();
            if ((date.getTime() - initDate.getTime()) % 500 == 0) {
                getFromFirebase(otherPersonDocName);        // GET OTHER PERSONS ARRAY FROM THEIR ACC
            }
        }
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        if (idsSaved) {
            findxy('down', e)
        }
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        if (idsSaved) {
            findxy('up', e)
            if (firebase_arr.length > 0) {
                // SEND ARRAY TO FIREBASE -> scroll down to another place were we have to store into firebase -------------------------------------
                storeToFirebase(firebase_arr, thisPersonDocName);
                firebase_arr = [];
                getFromFirebase(otherPersonDocName);
            }
        }
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        if (idsSaved) {
            findxy('out', e)
            getFromFirebase(otherPersonDocName);
            // SEND ARRAY TO FIREBASE HERE -------------------------------------
            if (firebase_arr.length > 0) {
                storeToFirebase(firebase_arr, thisPersonDocName);
                firebase_arr = [];
            }
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
    }


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

function erase() {
    ctx.clearRect(0, 0, w, h);
    document.getElementById("canvasimg").style.display = "none";
    firebase_arr = []
    db.collection(thisCollection).doc(thisPersonDocName).update({
        drawing: []
    })
    db.collection(thisCollection).doc(otherPersonDocName).update({
        drawing: []
    })

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
            storeToFirebase(firebase_arr, thisPersonDocName);
            firebase_arr = []
            update_counter = (update_counter + 1 % 5)
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
            if (update_counter % 5 == 0) {
                var d = new Date();
                firebase_arr.push(currX + "," + currY + "," + x + "," + d.getTime())
                // console.log(firebase_arr)
            }
            update_counter = (update_counter + 1 % 5)
            draw();
        }
    }
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
        if (board[i].includes("newline")) {
            ctx.beginPath();
            ctx.fillStyle = tempColorc;
            ctx.fillRect(tempXc, tempYc, 2, 2);
            ctx.closePath();
        }
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
    for (var i = 0; i < thisArray.length; i++) {
        db.collection(thisCollection).doc(thisPersonDocName).update({
            drawing: firebase.firestore.FieldValue.arrayUnion(thisArray[i])
        })
    }
    db.collection(thisCollection).doc(thisPersonDocName).update({
        drawing: firebase.firestore.FieldValue.arrayUnion('newline' + storeToFirebaseCounter)
    })
    storeToFirebaseCounter++;
}

function getFromFirebase(OtherUser) {
    // get thisArray from thisUser's account on firebase and return it
    db.collection(thisCollection).doc(otherPersonDocName).get().then(function (doc) {
        otherBoard = doc.data().drawing;
        updateDrawingBoard(otherBoard)        // UPDATE DRAWING BOARD
        db.collection(thisCollection).doc(otherPersonDocName).set({
            drawing: []
        })
    })
    console.log("getFromFirebase")
}
