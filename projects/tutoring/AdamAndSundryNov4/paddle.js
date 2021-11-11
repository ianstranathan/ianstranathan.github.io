class Paddle 
{
    constructor(x, y, w, h) 
    {
        this.position = [x, y];
        this.height = h;
        this.width = w;
        this.screen = [0, 0];
    }
                                   
    initScreen(x, y)
    {
        this.screen[0] = x;
        this.screen[1] = y;
    }
    setPosition(x, y)
    {
        if(y < this.screen[1] - this.height)
        {
            this.position[1] = y;
        }
        else
        {
            this.position[1] = this.screen[1] - this.height;
        }
    }

    display()
    {
        rect(this.position[0], this.position[1], this.width, this.height);
    }

    update(x, y)
    {
        this.setPosition(x, y);
        this.display();
    }
}
  