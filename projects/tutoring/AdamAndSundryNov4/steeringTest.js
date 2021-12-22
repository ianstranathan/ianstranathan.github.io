var theTestBoid = new Boid(400, 400)
var theMousePos = [0, 0];

function setup() 
{
    createCanvas(windowWidth, windowHeight);     
	background(40);
    theTestBoid.target = theMousePos;
}

function draw()
{
    // THE GAME LOOP
    // -get input
    // -update state
    // -render

    // UPDATE STATE
    theMousePos[0] = mouseX;
    theMousePos[1] = mouseY;
    theTestBoid.update();

    // RENDERING FROM HERE DOWN
    // clear canvas
    clear();
	background(40);

    // draw mouse
    fill(0, 0, 255);
    circle(theMousePos[0], theMousePos[1], 2.0 * theTestBoid.diameter);

    // draw boid
    theTestBoid.display();
}