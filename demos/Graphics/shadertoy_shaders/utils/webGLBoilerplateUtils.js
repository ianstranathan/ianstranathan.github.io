/**
 * Creates and compiles a shader.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} shaderSource The GLSL source code for the shader.
 * @param {number} shaderType The type of shader, VERTEX_SHADER or
 *     FRAGMENT_SHADER.
 * @return {!WebGLShader} The shader.
 */
function compileShader(gl, shaderSource, shaderType)
{
	// Create the shader object
	var shader = gl.createShader(shaderType);
	
	// Set the shader source code.
	gl.shaderSource(shader, shaderSource);
	
	// Compile the shader
	gl.compileShader(shader);
	
	// Check if it compiled
	var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (!success) {
		// Something went wrong during compilation; get the error
		throw "could not compile shader:" + gl.getShaderInfoLog(shader);
	}
	
	return shader;
};

		/**
 * Creates a program from 2 shaders.
 *
 * @param {!WebGLRenderingContext) gl The WebGL context.
 * @param {!WebGLShader} vertexShader A vertex shader.
 * @param {!WebGLShader} fragmentShader A fragment shader.
 * @return {!WebGLProgram} A program.
 */
function createProgram(gl, vertexShader, fragmentShader) 
{
	// create a program.
	var program = gl.createProgram();
	
	// attach the shaders.
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	
	// link the program.
	gl.linkProgram(program);
	
	// Check if it linked.
	var success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (!success) {
		// something went wrong with the link
		throw ("program filed to link:" + gl.getProgramInfoLog (program));
	}
	return program;
};

/**
 * Creates a shader from the content of a script tag.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} scriptId The id of the script tag.
 * @param {string} opt_shaderType. The type of shader to create.
 *     If not passed in will use the type attribute from the
 *     script tag.
 * @return {!WebGLShader} A shader.
 */
function createShaderFromScript(gl, scriptId, opt_shaderType) 
{
	// look up the script tag by id.
	var shaderScript = document.getElementById(scriptId);
	if (!shaderScript) {
	throw("*** Error: unknown script element" + scriptId);
	}
	
	// extract the contents of the script tag.
	var shaderSource = shaderScript.text;
	
	// If we didn't pass in a type, use the 'type' from
	// the script tag.
	if (!opt_shaderType) {
	if (shaderScript.type == "x-shader/x-vertex") {
		opt_shaderType = gl.VERTEX_SHADER;
	} else if (shaderScript.type == "x-shader/x-fragment") {
		opt_shaderType = gl.FRAGMENT_SHADER;
	} else if (!opt_shaderType) {
		throw("*** Error: shader type not set");
	}
	}
	
	return compileShader(gl, shaderSource, opt_shaderType);
};

/**
 * Creates a shader from the content of string literal.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {!MultilineTemplateLiteral} shaderLiteral the multiline literal.
 * @return {!WebGLShader} A shader.
 */
function createShaderFromMultilineTemplateLiterals(gl, shaderLiteral, opt_shaderType) 
{
	if (!shaderLiteral)
    {
      throw("*** Error: unknown string element" + shaderStringLiteral);
    }

    var shaderSource = shaderLiteral;

    // If we didn't pass in a type, use the 'type' from
    // the script tag.
    if (!opt_shaderType)
    {
  		if (shaderScript.type == "x-shader/x-vertex")
  		{
  			opt_shaderType = gl.VERTEX_SHADER;
  		}
  		else if (shaderScript.type == "x-shader/x-fragment")
  		{
  			opt_shaderType = gl.FRAGMENT_SHADER;
  		}
  		else if (!opt_shaderType)
  		{
  			throw("*** Error: shader type not set");
  		}
    }
    return compileShader(gl, shaderSource, opt_shaderType);
};
	
/**
 * Creates a program from 2 script tags.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} vertexShaderId The id of the vertex shader script tag.
 * @param {string} fragmentShaderId The id of the fragment shader script tag.
 * @return {!WebGLProgram} A program
 */
function createProgramFromScripts(gl, vertexShaderId, fragmentShaderId) 
{
	var vertexShader = createShaderFromScriptTag(gl, vertexShaderId, gl.VERTEX_SHADER);
	var fragmentShader = createShaderFromScriptTag(gl, fragmentShaderId, gl.FRAGMENT_SHADER);
	return createProgram(gl, vertexShader, fragmentShader);
};

function createProgramFromSources(gl, vertexShaderSource, fragShaderSource) 
{
	var vertexShader = createShaderFromMultilineTemplateLiterals(gl, vertexShaderSource, gl.VERTEX_SHADER);
	var fragmentShader = createShaderFromMultilineTemplateLiterals(gl, fragShaderSource, gl.FRAGMENT_SHADER);
	return createProgram(gl, vertexShader, fragmentShader);
};

function resize(canvas) 
{
	// Lookup the size the browser is displaying the canvas.
	var displayWidth  = canvas.clientWidth;
	var displayHeight = canvas.clientHeight;

	// Check if the canvas is not the same size.
	if (canvas.width  !== displayWidth ||
		canvas.height !== displayHeight) 
	{
		// Make the canvas the same size
		canvas.width  = displayWidth;
		canvas.height = displayHeight;
	}
}



