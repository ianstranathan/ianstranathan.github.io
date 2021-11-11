
var paddle1 = new Paddle(30, 0, 20, 20 * 6); // paddle(x,y,w,h, [ww, wh])
var theBall = new Ball(0, 0, 15);

var gameObjects = [];

function setup() 
{
	paddle1.initScreen(windowWidth, windowHeight) // global variables from p5, windowWidth, windowHeight
	// init ball position to middle of board
	theBall.pos[0] = windowWidth / 2.0;
	theBall.pos[1] = windowHeight / 2.0;

	fill(255);
	createCanvas(windowWidth, windowHeight);
	background(40);
}

function screenUpdate()
{
	clear();
	background(40);
}
function gameUpdate()
{
	// for(let i in gameObjects)
	// {

	// }
}
function draw()
{
	screenUpdate();
	theBall.display();
	paddle1.update(30, mouseY); // args = x, y 
}

/*
(0,0)############################################(windowWidth,0)
################################################################
################################################################
################################################################
################################################################
################################################################
################################################################
################################################################
################################################################
################################################################
################################################################
################################################################
################################################################
(0, windowHeight)##################### (windowWidth, windowWidth)
*/
