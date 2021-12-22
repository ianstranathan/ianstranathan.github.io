class Ball
{
    constructor(x, y, r, thePaddle)
    {
        this.paddle = thePaddle;
        this.radius = r;
        this.diameter = 2.0 * this.radius;
        this.speed = 5.0;
        this.pos = [x, y];
        this.velocity = [0., 0.];
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

        // random direction of velocity
        var randSign = Math.random(); // (0., 1)
        if(randSign > 0.5)
        {
            randSign = -1;
        }
        else
        {
            randSign = 1;
        }
        // initializing the velocity
        this.velocity[0] = (Math.random() + 0.1) * this.speed * randSign;
        this.velocity[1] = (Math.random() + 0.1) * this.speed * randSign;
    }
    display()
    {
        // this is p5's circle method
        // syntax: circle(x, y, diameter)
        circle(this.pos[0], this.pos[1], this.diameter);
    }
    collisionUpdate()
    {
        // top wall:
        if (this.pos[1] <= this.radius)
        {
            this.velocity[1] *= -1;
        }
        // bottom wall
        else if(this.pos[1] + this.radius >= this.screen[1])
        {
            this.velocity[1] *= -1;
        }
        // Paddle collision logic:
        // check if the ball is aligned with the paddle
        if(this.pos[1] >= this.paddle.pos[1] && this.pos[1] <= this.paddle.pos[1] + this.paddle.height)
        {
            // check if there's contact with the paddle
            if(this.pos[0] - this.radius <= this.paddle.pos[0] + this.paddle.width)
            {
                // correct the position (remove normal dir penetration dist)
                //let theCorrectiveDist = ( this.paddle.pos[0] + this.paddle.width ) - (this.pos[0] - this.radius);
                //this.pos[0] += theCorrectiveDist;
                // invert the velocity
                this.velocity[0] *= -1.1;
            }
        }
        // DELETE ME
        if(this.pos[0] >= this.screen[0])
        {
            this.velocity[0] *= -1.1;
        }
    }

    physicsUpdate()
    {
        for(let i in this.pos)
        {
            this.velocity[i] += this.acceleration[i];
            this.pos[i] += this.velocity[i];
        }
    }
    update()
    {
        // The order of a game loop update:
        // 1. Get Input
        // 2. Resolve entities according to change of state
        // 3. Render

        this.collisionUpdate();
        // The physics loop ( Euler Update)
        this.physicsUpdate();
        // set the velocity according to which wall it hits
        this.display();
    } 
}