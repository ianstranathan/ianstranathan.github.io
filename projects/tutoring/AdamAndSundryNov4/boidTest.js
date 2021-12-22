class Boid
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.diameter = 20;

        this.vel = [0, 0];
        this.accl = [0, 0]
        this.target = null;

        this.desiredMagnitude = 10;
    }
    display()
    {
        // r g b
        fill(255, 0, 0);
        circle(this.x, this.y, this.diameter);
    }

    update()
    {
        // (IAN)
       
        if(this.target != null)
        {
            let arr = [3,4];
            ss(arr, 2);
    
            // calc desired
            // relative position vector between target and boid
            let relPosVec = [this.target[0] - this.x, this.target[1] - this.y];
            // normalize relPosVec:
            let unitRelPosVec = nn(relPosVec);

            // scale according to desired strength:
            let desiredForce = ss(unitRelPosVec, this.desiredMagnitude);
            // calc steering
            let steeringForce = [desiredForce[0] - this.vel[0], desiredForce[1] - this.vel[1]];
            // add steering to accl
            this.accl[0] += steeringForce[0];
            this.accl[1] += steeringForce[1];
            // add accl to vel
            this.vel[0] += this.accl[0];
            this.vel[1] += this.accl[1];
            // add vel to position
            this.x += this.vel[0];
            this.y += this.vel[1];

            this.accl[0] = 0;
            this.accl[1] = 0;
        }
    }
}