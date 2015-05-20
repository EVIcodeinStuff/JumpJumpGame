


(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || 
            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById("jumpjumpCanvas"),
    color = "black",
    boxSpeed = 2;
    ctx = canvas.getContext("2d"),
    width = 700,
    height = 300,
    player = {
        x: width / 2,
        y: height - 15,
        width: 5,
        height: 5,
        speed: 3,
        velX: 0,
        velY: 0,
        jumping: false,
        grounded: false
    },
    keys = [],
    friction = 0.8,
    gravity = 0.22;

var boxes = [];
var lasers = [];
//random number generator
function randNumber(min, max){
    return Math.floor(Math.random() * max) + min;
}


//make some random boxes
boxes.push({
   x: randNumber(5, 550),
   y: randNumber(5, 180),
   width: randNumber(5, 80),
   height: randNumber(5, 80),
   goal: false,
   moveable: false
});

boxes.push({
   x: randNumber(1, 550),
   y: randNumber(1, 180),
   width: randNumber(5, 80),
   height: randNumber(5, 80),
   goal: false,
   moveable: false
});

boxes.push({
   x: randNumber(5, 450),
   y: randNumber(5, 280),
   width: randNumber(5, 90),
   height: randNumber(5, 70),
   goal: false,
   moveable: false
});

boxes.push({
   x: randNumber(1, 550),
   y: randNumber(1, 180),
   width: randNumber(5, 80),
   height: randNumber(5, 80),
   goal: false,
   moveable: false
});

boxes.push({
   x: randNumber(5, 650),
   y: randNumber(5, 180),
   width: randNumber(5, 90),
   height: randNumber(5, 80),
   goal: false,
   moveable: true,
   moveDir: false,
   upDownOrLeftRight: false
});

boxes.push({
   x: randNumber(5, 650),
   y: randNumber(100, 190),
   width: randNumber(10, 90),
   height: randNumber(10, 10),
   goal: false,
   moveable: true,
   moveDir: true,
   upDownOrLeftRight: true
});

boxes.push({
   x: randNumber(5, 550),
   y: randNumber(5, 100),
   width: randNumber(5, 80),
   height: randNumber(5, 80),
   goal: false,
   moveable: false
});

boxes.push({
   x: randNumber(1, 550),
   y: randNumber(1, 100),
   width: randNumber(5, 80),
   height: randNumber(5, 80),
   goal: false,
   moveable: false
});
//predefined boxes
// dimensions
boxes.push({
    x: 0,
    y: 0,
    width: 10,
    height: height,
    goal: false,
    moveable: false
});
boxes.push({
    x: 0,
    y: height - 2,
    width: width,
    height: 50,
    goal: false,
    moveable: false
});
boxes.push({
    x: width - 10,
    y: 0,
    width: 50,
    height: height,
    goal: false,
    moveable: false
});

boxes.push({
    x: 120,
    y: 20, 
    width: 80,
    height: 80,
    goal: false,
    moveable: false
});

boxes.push({
    x: 210,
    y: 120,
    width: 80,
    height: 80,
    goal: false,
    moveable: false
});

boxes.push({
    x: 430,
    y: 240,
    width: 80,
    height: 60,
    goal: false,
    moveable: false
});

boxes.push({
    x: 180,
    y: 70,
    width: 80,
    height: 80,
    goal: false,
    moveable: false
});

boxes.push({
    x: 340,
    y: 160,
    width: 60,
    height: 60,
    goal: false,
    moveable: false
});

boxes.push({
    x: 370,
    y: 110,
    width: 30,
    height: 40,
    goal: false,
    moveable: false
});
//goal box
boxes.push({
   x: 140,
   y:5,
   width:7,
   height:7,
   goal: true,
   moveable: false,
   color: "blue"
});

boxes.push({
   x: 540,
   y: 25,
   width:7,
   height:7,
   goal: true,
   moveable: false,
   color: "red"
});

canvas.width = width;
canvas.height = height;

function collisionCheck(shapeA, shapeB) {
    // get the vectors to check against
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
        // add the half widths and half heights of the objects
        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        colDir = null;
        
    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                shapeA.y += oY;
            } else {
                colDir = "b";
                shapeA.y -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                shapeA.x += oX;
            } else {
                colDir = "r";
                shapeA.x -= oX;
            }
        }
        if(shapeB.goal === true){
            color = shapeB.color;
            //location.reload(true);
        }
    }
    return colDir;
}

function update() {
    // check keys
    if (keys[38] || keys[32]) {
        // up arrow or space
        if (!player.jumping && player.grounded) {
            player.jumping = true;
            player.grounded = false;
            player.velY = -player.speed * 2;
        }
    }
    if (keys[39]) {
        // right arrow
        if (player.velX < player.speed) {
            player.velX++;
        }
    }
    if (keys[37]) {
        // left arrow
        if (player.velX > -player.speed) {
            player.velX--;
        }
    }
   
    //shoot lasers
    //shoot up
    if (keys[87]){
        if(lasers.length <= 10){
            lasers.push({
               x: player.x,
               y: player.y,
               width: 5,
               height: 10,
               direction: 1,
               laserSpeed: 3
            });
        }
    }
    //shoot left
    if (keys[65]){
        if(lasers.length <= 10){
            lasers.push({
               x: player.x,
               y: player.y,
               width: 10,
               height: 5,
               direction: 2,
               laserSpeed: 3
            });
        }
    }
    //shoot down
    if (keys[85]){
        if(lasers.length <= 10){
            lasers.push({
               x: player.x,
               y: player.y,
               width: 5,
               height: 10,
               direction: 3,
               laserSpeed: 3
            });
        }
    }
    //shoot right
    if (keys[68]){
        if(lasers.length <= 10){
            lasers.push({
               x: player.x,
               y: player.y,
               width: 10,
               height: 5,
               direction: 4,
               laserSpeed: 3
            });
        }
    }
    

    player.velX *= friction;
    player.velY += gravity;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = color;
    ctx.beginPath();
    
    player.grounded = false;
    for (var i = 0; i < boxes.length; i++) {
        //can the box move?
        if(boxes[i].moveable === true){
            //upDownOrLeftRight true means horizontal movement
            //right to left move is true
            if(boxes[i].upDownOrLeftRight === true){
                if(boxes[i].moveDir === true && boxes[i].x != width){
                    boxes[i].x += boxSpeed;
                    if(boxes[i].x >= width - boxes[i].width){
                        boxes[i].moveDir = false;
                    }
                }
                //left to right move is false
                if(boxes[i].moveDir === false && boxes[i].x != 0){
                    boxes[i].x -= boxSpeed;
                    if(boxes[i].x <= 0){
                        boxes[i].moveDir = true;
                    }
                }
            }
            //upDownOrLeftRight movement is vertical
            //down to up move is true
            else{
                if(boxes[i].moveDir === true && boxes[i].y !== 0){
                    boxes[i].y -= boxSpeed;
                    if(boxes[i].y <= 0){
                        boxes[i].moveDir = false;
                    }
                }
                //up to down move is false
                if(boxes[i].moveDir === false && boxes[i].y !== height){
                    boxes[i].y += boxSpeed;
                    if(boxes[i].y >= height - boxes[i].height){
                        boxes[i].moveDir = true;
                    }
                }
            }
            
            
        }//end movement if statement
        ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);
        
        var dir = collisionCheck(player, boxes[i]);

        if (dir === "l" || dir === "r") {
            player.velX = 0;
            player.jumping = false;
        } else if (dir === "b") {
            player.grounded = true;
            player.jumping = false;
        } else if (dir === "t") {
            player.velY *= -1;
        }

    }
    
    //draw lasers
    if(lasers.length > 0){
        for (var i = 0; i < lasers.length; i++){
            ctx.rect(lasers[i].x, lasers[i].y, lasers[i].width, lasers[i].height);
            //update position
            if(lasers[i].direction === 1){
                lasers[i].y -= lasers[i].laserSpeed;
                if(lasers[i].y < 0){
                    lasers.pop();
                }
            }
            else if(lasers[i].direction === 2){
                lasers[i].x -= lasers[i].laserSpeed;
                if(lasers[i].x < 0){
                    lasers.pop();
                }
            }

            else if(lasers[i].direction === 3){
                lasers[i].y += lasers[i].laserSpeed;
                if(lasers[i].y > height){
                    lasers.pop();
                }
            }

            else if(lasers[i].direction === 4){
                lasers[i].x += lasers[i].laserSpeed;
                if(lasers[i].x > width){
                    lasers.pop();
                }
            }
        }
    }
    
    if(player.grounded){
         player.velY = 0;
    }
    
    player.x += player.velX;
    player.y += player.velY;

    ctx.fill();
    ctx.fillStyle = "green";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(update);
}


document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});

window.addEventListener("load", function () {
    update();
});

