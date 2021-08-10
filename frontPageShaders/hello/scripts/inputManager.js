class InputManager
{
    constructor(gl, shaderObj, renderable)
    {
        this.time = 0.0;
        //
        this.renderable = renderable;
        //
        this.availablePrograms = new Map();
        this.programUniformsLocs = new Map();
        //
        this.shaders = shaderObj.shaders;
        this.numberOfShaders = this.shaders.length;
        this.shaderIndexNum = shaderObj.currentShaderIndex;
        this.arrOfUsedShaderIndices = [];
        //
        this.mousePos = vec2.create();
        //
        this.gl = gl;
        gl.canvas.addEventListener( "mousedown", this.mouseDown);
        gl.canvas.addEventListener( "mousemove", this.mouseMove);
        gl.canvas.addEventListener( "mouseup", this.mouseUp);

        this.init();
    }
    init()
    {
        // save program data
        this.availablePrograms.set(this.shaderIndexNum, this.renderable[0].program);
        this.programUniformsLocs.set(this.shaderIndexNum, this.renderable[0].uniformLocations);

        // add init shader index:
        this.arrOfUsedShaderIndices.push(this.shaderIndexNum);
    }
    mouseDown = event => 
    {
        this.getMousePos(event);
        // reset time for shader animations
        this.time = 0.
        //console.log("( " + this.mousePos[0] + ", " + this.mousePos[1] + " )");

        // number between 0 and however many shaders are in container
        this.shaderIndexNum = (this.shaderIndexNum + 1) % (this.numberOfShaders);

        let haventUsedThisShaderYet = true;

        for(let i in this.arrOfUsedShaderIndices)
        {
            // check each used index
            if(this.shaderIndexNum == this.arrOfUsedShaderIndices[i])
            {
                haventUsedThisShaderYet = false;
            }
        }

        // if we got through the used indices and we're still good:
        if(haventUsedThisShaderYet)
        {
            var aProgram = createProgramFromSources(this.gl, this.shaders[this.shaderIndexNum][0], this.shaders[this.shaderIndexNum][1]);
            var aProgramUTime = this.gl.getUniformLocation(aProgram, "time");
            var aProgramUResolution = this.gl.getUniformLocation(aProgram, "resolution");
            var aProgramUMouse = this.gl.getUniformLocation(aProgram, "mousePos");

            var uniformLocs = {resolution: aProgramUResolution,
                               time: aProgramUTime,
                               mousePos: aProgramUMouse
                              }

            // save the shader program
            this.availablePrograms.set(this.shaderIndexNum, aProgram);
            this.programUniformsLocs.set(this.shaderIndexNum, uniformLocs);

            this.renderable[0].program = aProgram;
            this.renderable[0].uniformLocations = uniformLocs;

            // mark this index as used
            this.arrOfUsedShaderIndices.push(this.shaderIndexNum)

            // use the new program
            this.gl.useProgram(this.renderable[0].program);
        }
        else
        {
            // otherwise use whatever the index is at
            this.renderable[0].program = this.availablePrograms.get(this.shaderIndexNum);
            this.renderable[0].uniformLocations = this.programUniformsLocs.get(this.shaderIndexNum);;

            this.gl.useProgram(this.renderable[0].program);
        }

        
    }
    mouseMove = event => 
    {
        this.getMousePos(event);
    }
    mouseUp = event => 
    {
    }

    // keeping it D.R.Y
    getMousePos(event)
    {
        this.mousePos[0] = (2. * event.offsetX / this.gl.canvas.width - 1.);
        this.mousePos[1] = -1 * (2. * event.offsetY /  this.gl.canvas.height - 1.);
    }
}