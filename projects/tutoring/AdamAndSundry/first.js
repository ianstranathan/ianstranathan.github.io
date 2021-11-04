
var paddle1 = new Paddle(0, 0, 20, 20 * 6); // paddle(x,y,w,h, [ww, wh])

function setup() 
{
	paddle1.initScreen(windowWidth, windowHeight)
	fill(255);
	createCanvas(windowWidth, windowHeight);
	background(40);
}

function screenUpdate()
{
	clear();
	background(40);
}

// happening 60 times per sec
function draw()
{
	screenUpdate();
	paddle1.update(30, mouseY); // args = x, y 
}

