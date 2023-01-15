let paddle_x, paddle_y, paddle_width, paddle_height, paddle_dx;
let brick_col, brick_row, bricks, x, y, padding;
let ball_x, ball_y, ball_diameter, ball_dx, ball_dy, angle, direction, velocity;
let score, str_x, str_y;
let lives, lives_x, lives_y;

function setup() {  
  createCanvas(450, 450);
  background("hsl(200, 50%, 50%)");
  
  score = 0;
  str_x = 15;
  str_y = 20;
  
  lives = 3;
  lives_x = 370;
  lives_y = 20;
  
  brick_row = 3;
  brick_col = 5;
  bricks = [];

  for(let r = 0; r < brick_row; r++)
  {
    bricks[r] = [];
    for(let c = 0; c < brick_col; c++)
    {
      bricks[r][c] = {
        x : 0,
        y : 0,
        status: true
      }    
    }
  }

  reset_game();
  noLoop();
}

function mousePressed() {
  loop();
}

function reset_game() {
  ball_diameter = 20;
  ball_x = width/2 - ball_diameter/2;
  ball_y = height/2 - ball_diameter/2;
  
  direction = {
    ball_dx : 0,
    ball_dy : 0
  };
  while(abs(direction.ball_dx) <= 0.2 || abs(direction.ball_dx) >= 0.9) {
    angle = random(0,TWO_PI);
    direction.ball_dx = cos(angle);
    direction.ball_dy = sin(angle);
  }
  
  velocity = 4;
  
  paddle_dx = 3;
  paddle_width = 100;
  paddle_height = 15;
  paddle_x = width/2 - paddle_width/2;
  paddle_y = height - 25;
}

function draw() {
  background("hsl(200,50%, 50%)");
  fill("rgb(255,255,255)");
  
  if(score == 15) {
    reset_game();
    noLoop();
    textSize(24);
    text("YOU WON 😊", 155, 100);
  }
  
  if(!lives) {
    reset_game();
    noLoop();
    textSize(24);
    text("YOU LOST 😔", 155, 300);
  }
  
  if((ball_x + ball_diameter/2) >= width)
    direction.ball_dx = -direction.ball_dx;
  
  if((ball_x - ball_diameter/2) <= 0)
    direction.ball_dx = -direction.ball_dx;
  
  if((ball_y + ball_diameter/2) >= height) {
    lives = lives - 1;
    reset_game();
  }
  
  if((ball_y - ball_diameter/2) <= 0)
    direction.ball_dy = -direction.ball_dy;
  
  if( 
    (ball_x + ball_diameter/2 >= paddle_x) &&
    (ball_x - ball_diameter/2 <= paddle_x + paddle_width) &&
    (ball_y + ball_diameter/2 >= paddle_y) &&
    (ball_y - ball_diameter/2 <= paddle_y + paddle_height)  
  )
    direction.ball_dy = -direction.ball_dy;
    
  
  let brick_width = 75;
  let brick_height = 20;
  let brick_padding = 12;
  let initial_height = 50;
  let initial_width = 13;
  for(let r = 0; r < brick_row; r++)
  {
    for(let c = 0; c < brick_col; c++)
    {
      bricks[r][c].x = c * (brick_width + brick_padding) + initial_width;
      bricks[r][c].y = r * (brick_height + brick_padding) + initial_height;
      if(bricks[r][c].status) 
        rect(bricks[r][c].x, bricks[r][c].y, brick_width, brick_height);
      
      if(bricks[r][c].status) {
        if( (ball_x + ball_diameter/2 >= bricks[r][c].x) &&
            (ball_x - ball_diameter/2 <= bricks[r][c].x + brick_width) &&
            (ball_y + ball_diameter/2 >= bricks[r][c].y) &&
            (ball_y - ball_diameter/2 <= bricks[r][c].y + brick_height) ) {
            bricks[r][c].status = false;
            direction.ball_dy = -direction.ball_dy;
            score = score + 1;
        }
      }
    }
  }

  textSize(16);
  text("Score : " + score, str_x, str_y);
  text("Lives : " + lives, lives_x, lives_y);
  
  ball_x += (direction.ball_dx)*velocity;
  ball_y += (direction.ball_dy)*velocity;
  
  if(keyIsDown(LEFT_ARROW) && paddle_x-paddle_dx >= 0) 
    paddle_x = paddle_x - paddle_dx;

  if(keyIsDown(RIGHT_ARROW) && paddle_x+paddle_dx+paddle_width<= width) 
    paddle_x = paddle_x + paddle_dx;
  
  rect(paddle_x, paddle_y, paddle_width, paddle_height);
  circle(ball_x, ball_y, ball_diameter);
}