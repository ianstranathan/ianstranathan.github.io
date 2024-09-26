var testingVS = `#version 300 es

precision highp float;

layout (location=0) in vec3 vertexPos;

void main()
{
    gl_Position =  vec4(vertexPos, 1.0);
}
`

var testingFS = `#version 300 es

precision highp float;

out vec4 fragColor;

uniform vec2 resolution;
uniform vec2 mousePos;
uniform float time;

void main()
{
    //vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
    vec2 uv = (2. * gl_FragCoord.xy / resolution.xy) - 1.;
    uv.x *= resolution.x / resolution.y;
    vec2 mouse = mousePos;
    mouse.x *= resolution.x / resolution.y;
    uv -= mouse;
    vec3 col = 0.5 + 0.5*cos(time + uv.xyx+vec3(0,2,4)) * (1. - smoothstep(0.3, 0.31, length(uv)));
    fragColor = vec4(col, 1.);
}`