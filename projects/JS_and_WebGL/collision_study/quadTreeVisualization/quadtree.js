class QuadTree
{
    constructor(cell, capcity)
    {
        this.cell = cell;
        this.capacity = capcity;
        this.points = [];
        this.subdivided = false;
        this.lineCol = [255, 255, 255];
    }

    insert(aPoint)
    {
        if(!this.cell.contains(aPoint))
        {
            return;
        }

        if(this.points.length < this.capacity)
        {
            this.points.push(aPoint);
        }
        else
        {
            if(!this.subdivided)
            {
                this.subdivide();
                this.subdivided = true;
            }
            this.northeast.insert(aPoint);
            this.northwest.insert(aPoint);
            this.southeast.insert(aPoint);
            this.southwest.insert(aPoint);
        }
    }

    subdivide()
    {
        let subdividiedHalfWidth = this.cell.halfWidth / 2;
        let subdividiedHalfHeight = this.cell.halfHeight / 2;

        //
        let ne = new QuadTreeCell(
                                    vec2.fromValues(this.cell.center[0] + subdividiedHalfWidth, this.cell.center[1] + subdividiedHalfHeight),
                                    subdividiedHalfWidth,
                                    subdividiedHalfHeight
                                 );
        let nw = new QuadTreeCell(
                                    vec2.fromValues(this.cell.center[0] - subdividiedHalfWidth, this.cell.center[1] + subdividiedHalfHeight),
                                    subdividiedHalfWidth,
                                    subdividiedHalfHeight
                                 );
        let se = new QuadTreeCell(
                                    vec2.fromValues(this.cell.center[0] + subdividiedHalfWidth, this.cell.center[1] - subdividiedHalfHeight),
                                    subdividiedHalfWidth,
                                    subdividiedHalfHeight
                                 );
        let sw = new QuadTreeCell(
                                    vec2.fromValues(this.cell.center[0] - subdividiedHalfWidth, this.cell.center[1] - subdividiedHalfHeight),
                                    subdividiedHalfWidth,
                                    subdividiedHalfHeight
                                 );
        
        // each cell with return if not in bounds of cell, so each new quadtree can be fed an arbitrary point
        this.northeast = new QuadTree(ne, this.capacity);
        this.northwest = new QuadTree(nw, this.capacity);
        this.southeast = new QuadTree(se, this.capacity);
        this.southwest = new QuadTree(sw, this.capacity);  
    }

    query(interval, found)
    {
        // first level of recursion won't have found arr
        if(!found)
        {
            found = [];
        }
        if(!this.cell.intersects(interval))
        {
            return found;
        }
        else
        {
            for ( let p in this.points)
            {
                if(interval.contains(this.points[p]))
                {
                    found.push(this.points[p]);
                }
            }
            if(this.subdivided)
            {
                this.northeast.query(interval, found);
                this.northwest.query(interval, found);
                this.southeast.query(interval, found);
                this.southwest.query(interval, found);
            }
        }
        return found;
    }
    //
    display()
    {
        stroke(this.lineCol[0], this.lineCol[1], this.lineCol[2]);
        strokeWeight(1);
        noFill();
        rectMode(CENTER);
        rect(this.cell.center[0], this.cell.center[1], this.cell.halfWidth * 2, this.cell.halfHeight * 2);
        if(this.subdivided)
        {
            this.northeast.display();
            this.northwest.display();
            this.southeast.display();
            this.southwest.display();
        }
        strokeWeight(4);
        for( let p in this.points)
        {
            point(this.points[p][0], this.points[p][1]);
        }
    }
}