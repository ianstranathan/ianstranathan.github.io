
var gameObjects = [];
// var debugFlags = {DEBUG:}

// presetup()
// {
	
// }

function makeGameObjects()
{
	var paddle1 = new Paddle(30, 0, PADDLE_WIDTH, PADDLE_HEIGHT);
	var paddle2 = new ComputerPaddle(windowWidth - 30, 0, PADDLE_WIDTH, PADDLE_HEIGHT);
	var theBall = new Ball(0, 0, BALL_RADIUS, paddle1);
	gameObjects.push(paddle1);
	gameObjects.push(paddle2);
	gameObjects.push(theBall);
}

function setup() 
{
	// presetup()
	// {

	// }
	// if(DEBUG)
	// {
	// 	frameRate(5)
	// }
	// else
	// {
	// 	frameRate(60)
	// }
	
	makeGameObjects(); 	   					 // make all game objects			   					 
	init();                					 // initialize
	createCanvas(windowWidth, windowHeight); // make html5 canvas through p5
}

function init()
{
	fill(255);      // set fill color from p5 API
	background(40); // 

	for(let i in gameObjects)
	{
		gameObjects[i].init(windowWidth, windowHeight);
	}
}

function screenUpdate()
{
	clear();
	background(40);
}

function gameLoop()
{
	for(let i in gameObjects)
	{
		// manage input -- move paddle
		processInput(gameObjects[i])
		// process state -- check for collisions between the ball and the paddles

		// render
		gameObjects[i].update();
	}
}

function processInput(gameObj)
{
	if(gameObj.controllable)
	{
		gameObj.mousePos = [mouseX, mouseY];
	}
}

function draw()
{
	screenUpdate();
	gameLoop();
}