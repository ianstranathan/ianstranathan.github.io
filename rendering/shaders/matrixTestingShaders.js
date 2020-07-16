var matrixTestVS = `#version 300 es

precision highp float;

in vec3 vertexPos;

uniform float time;
// #----------
// transformation matrices:

uniform mat4 view;
//uniform mat4 projection;
uniform mat4 model;

out vec3 v_Barycentric;

void main() 
{
    //v_Barycentric = vec3(0.0);
    //v_Barycentric[int(mod(float(gl_VertexID), 3.0))] = 1.0;
    //gl_Position = projection * view * model * vec4(vertexPos, 1.0);
    vec4 pos = view * model * vec4(vertexPos, 1.0);
    gl_Position = vec4(pos.x, pos.y, 0., 1.);
    //gl_Position = model * vec4(vertexPos, 1.);
}
`

var matrixTestFS = `#version 300 es

precision highp float;

in vec3 v_Barycentric;
out vec4 fragColor;

uniform float time;
uniform vec2 resolution;

#define PI (3.1415)

// float edgeFactor()
// {
//     // like the avergae of dFdx & dFdy
//     vec3 d = fwidth(v_Barycentric);
//     // 
//     vec3 val = smoothstep(vec3(0.0), d*4.5, v_Barycentric);

//     // return the min of any of the vector's components
//     return min(min(val.x, val.y), val.z);
// }

void main()
{
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy)/ resolution.y;
    // fragColor = vec4(0.0, 0.0, 0.0, (1.0-edgeFactor())*0.95);

    vec3 col = 0.5 + 0.5*cos(time +uv.xyx + vec3(0,2,4));
    fragColor = vec4(col, 1.);
}
`