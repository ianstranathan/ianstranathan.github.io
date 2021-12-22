class ComputerPaddle 
{
    constructor(x, y, w, h) 
    {
        this.pos = [x, y];
        this.height = h;
        this.width = w;
        this.screen = [0, 0];
        this.controllable = false;
    }                            
    init(x, y)
    {
        this.screen[0] = x;
        this.screen[1] = y;
        this.setPosition(this.screen[1] / 2.0);
    }
    
    setPosition(y)
    {
        this.pos[1] = y;
    }

    display()
    {
        rect(this.pos[0], this.pos[1], this.width, this.height);
    }

    update()
    {
        //this.setPosition(this.mousePos[1]);
        this.display();
    }
}
  