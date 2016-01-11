document.addEventListener("DOMContentLoaded", function(event) {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  var playing = false;
  var animator;

  var ballRadius = 10;
  var ballXPosition = canvas.width/2;
  var ballYPosition = canvas.height-30;
  var ballColor = "green";
  var dXball = 1;
  var dYball = -1;

  var paddleHeight = 10;
  var paddleWidth = 75;
  var paddleX = (canvas.width-paddleWidth)/2;
  var paddleSpeed = 7;

  var bricks;
  var brickRowCount = 3;
  var brickColumnCount = 5;
  var brickWidth = 75;
  var brickHeight = 20;
  var brickPadding = 10;
  var brickOffsetTop = 15;
  var brickOffsetLeft = 30;

  var rightPressed = false;
  var leftPressed = false;
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
 
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    checkInput();
    checkCollisions();
    moveBall();
  }
  
  function start() {
    console.log("GO!");
    resetBall();   
    resetBricks();
    playing = true;
    animator = setInterval(draw, 10);
  }

  function resetBall() {
    ballXPosition = canvas.width/2;
    ballYPosition = canvas.height-30;
    dXball = 1;
    dYball = -1;
  }

  function resetBricks() {
    bricks = [];
    for(c=0; c<brickColumnCount; c++) {
      bricks[c] = [];
      for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
  }

  function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
  }

  function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
      for(r=0; r<brickRowCount; r++) {
        if(bricks[c][r].status == 1) {
          var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
          var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "#0095DD";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  function moveBall() {
    ballXPosition += dXball;
    ballYPosition += dYball;
  }

  function checkCollisions() {
    checkTopAndSideCollisions();  
    checkBrickCollisions();
    checkPaddleCollisions();
    checkGameOver();
  }

  function checkTopAndSideCollisions() {
    if (ballXPosition + dXball > canvas.width-ballRadius  || ballXPosition + dXball < ballRadius) {
      dXball = -dXball;
    }

    if (ballYPosition  + dYball < ballRadius) {
      dYball = -dYball;
    }
  }

  function checkPaddleCollisions() {
    if (ballYPosition + dYball > (canvas.height-ballRadius) - paddleHeight) {
      if(ballXPosition > paddleX && ballXPosition < paddleX + paddleWidth) {
        dYball = -dYball;
        increaseSpeed();
      }
    }
  }

  function increaseSpeed() {
    if (dYball < 4 || dXball < 4) {
      dYball = dYball * 1.1;
      dXball = dXball * 1.1;
    }
  }

  function checkBrickCollisions() {
    for(c=0; c<brickColumnCount; c++) {
      for(r=0; r<brickRowCount; r++) {
        var b = bricks[c][r];
        if(b.status == 1) {
          if(ballXPosition > b.x && ballXPosition < b.x+brickWidth && ballYPosition > b.y && ballYPosition < b.y+brickHeight) {
            dYball = -dYball;
            b.status = 0;
            ballColor = getRandomColor();
          }
        }
      }
    }
  }

  function checkInput() {
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
          paddleX += paddleSpeed;
    }
    else if(leftPressed && paddleX > 0) {
          paddleX -= paddleSpeed;
    }
  }

  function checkGameOver(cb) {
    if (ballYPosition + dYball > canvas.height - ballRadius) {
      console.log("Game Over!");
      playing = "false";
      clearInterval(animator);
      document.location.reload();
    }
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(ballXPosition, ballYPosition, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
  }

  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

  function keyDownHandler(e) {
    if (e.keyCode == 32 && !playing) {
      start();
    } else if (e.keyCode == 39) {
      rightPressed = true;
    }
    else if (e.keyCode == 37) {
      leftPressed = true;
    }
  }

  function keyUpHandler(e) {
    if (e.keyCode == 39) {
      rightPressed = false;
    }
    else if (e.keyCode == 37) {
      leftPressed = false;
    }
  }

  function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

});
