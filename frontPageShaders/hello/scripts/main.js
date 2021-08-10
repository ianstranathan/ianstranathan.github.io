'use strict';

function main()
{
    var canvas = document.getElementById("cc");
    var gl = canvas.getContext('webgl2');
    
    var shaderSourceContainer = 
    [
        [rayMarchOneVS, rayMarchOneFS],
        [noiseOneVS, noiseOneFS],
        [trefoilVS, trefoilFS],
        [gaussianWaveVS, gaussianWaveFS],
        [goldenSpiralOneVS, goldenSpiralOneFS],
        [oldWebsiteMouseVS, oldWebsiteMouseFS]
    ];
    
    var rnd = 5; //Math.floor(Math.random() * numShaders);

    //
    var renderables = [];

    var helloProgram = createProgramFromSources(gl, shaderSourceContainer[rnd][0], shaderSourceContainer[rnd][1]);
    var helloProgramUTime = gl.getUniformLocation(helloProgram, "time");
    var helloProgramUResolution = gl.getUniformLocation(helloProgram, "resolution");
    var helloProgramUMouse = gl.getUniformLocation(helloProgram, "mousePos");
    
    var quadVAO = gl.createVertexArray();
    var quadVBO = gl.createBuffer();
    gl.bindVertexArray(quadVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, quadVBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(theUnitQuad), gl.STATIC_DRAW);
    var stride = 0; // byte stride
    var offset = 0;
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, offset);
    gl.enableVertexAttribArray(0);
    
    var quadModel = mat4.create();

    renderables.push(
        {tag: "screenQuad",
        transform: quadModel,
        vao: quadVAO,
        primitiveType: gl.TRIANGLES,
        vertCount: 6,
        program: helloProgram,
        uniformLocations: {resolution: helloProgramUResolution,
                           time: helloProgramUTime,
                           mousePos: helloProgramUMouse
                        }
        });
    
    // ---------------- WebGL State Init ----------------
    gl.clearColor(clearCol[0], clearCol[1], clearCol[2], clearCol[3]);
    gl.enable(gl.DEPTH_TEST);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // ---------------- Time Init ----------------
    var oldTimeStamp = 0.0;
    var time = 0.0;
    var deltaTime = 0.0;
    
    // -- no need to do this more than once
    gl.useProgram(helloProgram)
    gl.bindVertexArray(quadVAO);

    var shaderObj = {shaders: shaderSourceContainer, currentShaderIndex: rnd};

    var inputManager = new InputManager(gl, shaderObj, renderables);

    // ---------------- Start Render Loop ----------------
    window.requestAnimationFrame(render);

    function render(timeStamp) 
    {
        // -------- Resize canvas --------
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        resize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // -------- Time Update -------- 
        deltaTime = (timeStamp - oldTimeStamp) / 1000.0; // in seconds
        oldTimeStamp = timeStamp;
        inputManager.time += deltaTime;    
        
        // -------- Uniform Update -------- 
        gl.uniform1f(renderables[0].uniformLocations["time"], inputManager.time);
        gl.uniform2f(renderables[0].uniformLocations["mousePos"], inputManager.mousePos[0], inputManager.mousePos[1]);
        gl.uniform2f(renderables[0].uniformLocations["resolution"], gl.canvas.width, gl.canvas.height);
        gl.drawArrays(renderables[0].primitiveType, 0, renderables[0].vertCount);
        
        // -------- Restart Render Loop --------
        window.requestAnimationFrame(render);
	}
}

main();
