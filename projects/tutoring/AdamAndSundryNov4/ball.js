class Ball
{
    constructor(x, y, r)
    {
        this.radius = r;
        this.diameter = 2.0 * this.radius;
        this.speed = 5.0;
        this.pos = [x, y];
        this.velocity = [Math.random() * this.speed, Math.random() * this.speed]; // random() --> [0, speed]
        this.acceleration = [0, 0];
        this.screen = [0, 0];
        this.controllable = false;
    }
    init(screenWidth, screenHeight)
    {
        this.screen[0] = screenWidth;
        this.screen[1] = screenHeight;
        this.pos[0] =    screenWidth / 2.0;
        this.pos[1] =    screenHeight / 2.0;
    }
    display()
    {
        // this is p5's circle method
        // syntax: circle(x, y, diameter)
        circle(this.pos[0], this.pos[1], this.diameter);
    }
    update()
    {
        for(let i in this.pos)
        {
            this.velocity[i] += this.acceleration[i];
            this.pos[i] += this.velocity[i];
        } 
        // set the velocity according to which wall it hits
        this.display();
    } 
}