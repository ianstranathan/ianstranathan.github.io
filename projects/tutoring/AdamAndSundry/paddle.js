// OOP

// encapsulate data with functionality

// "Rectangle" object

class Paddle 
{
    constructor(x, y, w, h) 
    {
        this.position = [x, y];
        this.height = h;
        this.width = w;
        this.screen = [0, 0];
    }

    // functions inside objects are usually called methods
    getArea()
    {
        console.log(this.height * this.width);
    }

    getPerimeter()
    {
        console.log(2 * this.width + 2 * this.height);
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
            this.position[0] = x;
            this.position[1] = y;
        }
        else
        {
            this.position[0] = x;
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
  