var goldenSpiralOneVS = `#version 300 es

precision highp float;

layout (location=0) in vec3 vertexPos;

void main()
{
    gl_Position =  vec4(vertexPos, 1.0);
}
`

var goldenSpiralOneFS = `#version 300 es

precision highp float;

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;

#define pi (3.14159265359)
#define bb (0.3063489)
#define SCALE (10.)

//float phi = (1.0 + sqrt(5.0)) / 2.0;
//float b = 10.; 
//float a = phi * b;
//float bb = log(phi) / (pi / 2.0);

#define BLUE (vec3(0.2, .25, .7))
#define GOLD (vec3(.95, 0.743, 0.1))

float when_gt(float x, float y)
{
    return max(sign(x - y), 0.0);
}
float when_lt(float x, float y)
{
    return max(sign(y - x), 0.0);
}

float graph(float func, float domain, float growFactor, float deltaFactor)
{
    float delta = (growFactor) / 5. + 0.2;; 
    return (
            smoothstep(func, func + delta, domain) * 
            (1. - smoothstep(func + delta, func + deltaFactor * delta, domain))
            );
}

float normalizeOnRange(float a, float b, float x)
{
    return (b - x) / (b - a);
}

float highlightExpansion(float center, float val, float sharpness)
{
    return (exp(-sharpness * pow(val - center, 2.)));
}

void main()
{
    // coordinates (from -SCALE to SCALE)
    vec2 uv = 2. * SCALE * (gl_FragCoord.xy - 0.5 * resolution.xy)/resolution.y;
    float r = length(uv);
   
    mat2 rotMat = mat2(cos(-time), -sin(-time), 
                      sin(-time),  cos(-time));
    uv = rotMat * uv;
    float theta = atan(uv.y, uv.x) + pi;
    float angle = theta;
    
    float goldSpiral = graph(exp(bb * angle), length(uv), r, 1.3);
    float whiteSpiral = graph(exp(bb * (angle - 3.)) , length(uv), r, 3.);
    float blueSpiral = graph(exp(bb * (angle - 4.)) , length(uv), r, 2.);
    
   
    for(int i = 1; i < 5; i++)
    {
        angle +=  2. * (pi);
        goldSpiral += graph(exp(bb * angle) , length(uv), r, 1.3);
        whiteSpiral += graph(exp(bb * (angle - 3.)), length(uv), r, 3.); 
        blueSpiral += graph(exp(bb * (angle - 4.)) , length(uv), r, 2.);
    }
    
    whiteSpiral = 1. - normalizeOnRange(0., 1., whiteSpiral);
    whiteSpiral = pow(whiteSpiral, 8.) + highlightExpansion(1., whiteSpiral, 1000.);
    
    float blueFractSpiral = 1. - clamp(2. * abs( fract(3. * blueSpiral) - 0.5), 0., 1.);
    float goldFractSpiral = 1. - clamp(2. * abs( fract(2. * goldSpiral) - 0.5), 0., 1.);
    
    vec3 col = blueFractSpiral * BLUE + (1. - blueFractSpiral) * goldFractSpiral * GOLD + vec3(whiteSpiral);// + vec3(whiteSpiralMask);
    fragColor = vec4(col,1.0);
}
`