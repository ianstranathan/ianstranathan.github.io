class Ball
{
    constructor(x, y, r)
    {
        this.radius = r;
        this.diameter = 2.0 * this.radius;
        // kinematic properties
        this.speed = 5.0;
        this.pos = [x, y];
        this.velocity = [Math.random() * this.speed, Math.random() * this.speed]; // random() --> [0, speed]
        this.acceleration = [0, 0];
    }
    update()
    {
        
    }
    display()
    {
        // this is p5's circle method
        // syntax: circle(x, y, diameter)
        circle(this.pos[0], this.pos[1], this.diameter);
    } 
}