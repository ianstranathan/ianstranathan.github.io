
var gameObjects = [];

function makeGameObjects()
{
	var paddle1 = new Paddle(30, 0, 20, 20 * 6);
	var theBall = new Ball(0, 0, 15);
	gameObjects.push(paddle1);
	gameObjects.push(theBall);
}

function setup() 
{
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

function gameUpdate()
{
	for(let i in gameObjects)
	{
		if(gameObjects[i].controllable)
		{
			gameObjects[i].mousePos = [mouseX, mouseY];
		}
		gameObjects[i].update();
	}
}

function draw()
{
	screenUpdate();
	gameUpdate();
}