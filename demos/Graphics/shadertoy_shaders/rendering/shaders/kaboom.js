var kaboomVS = `#version 300 es

precision highp float;

layout (location=0) in vec3 vertexPos;

void main()
{
    gl_Position =  vec4(vertexPos, 1.0);
}
`

var kaboomFS = `#version 300 es

precision highp float;

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;
uniform vec2 mousePos;

// Constants
#define PI (3.14159)

// Raymarching params
#define MAX_STEPS (100)
#define MIN_DIST  (0.001)
#define MAX_DIST  (100.0)

// Function macros
#define ss smoothstep
#define UP vec3(0., 1., 0.)

// Misc.
#define SPHERE vec4(0., 0., 0., 1.)
#define timeMult 0.2 
#define BLOW_UP_TIME (2.)

// Colors
//#define backgroundCol vec3(0.1, 0.6, 0.8)
#define backgroundCol vec3(.9, .9, .35)
#define yellow vec3(1.7, 1.3, 1.0)
#define orange vec3(1.0, 0.6, 0.0)
#define red vec3(1.0, 0.0, 0.0)
#define darkGray vec3(0.05, 0.05, 0.05)
#define gray vec3(0.5, 0.5, 0.5)


// Util functions
// -------------------------------------------------------
float when_lt(float x, float y)
{
  return max(sign(y - x), 0.0);
}

float when_gt(float x, float y) 
{
  return max(sign(x - y), 0.0);
}

float easeExp(float x) 
{
    return (pow(2., 10. * x - 10.));
}

mat2 Rotate(float angle)
{
	return mat2(cos(angle), sin(angle), -sin(angle), cos(angle));   
}

// SSLOY's noise functions
// -------------------------------------------------------
float hash(const float n) 
{
    float x = sin(n) * 43758.5453f;
    
    return ( x - floor(x) );
}

float noise2(const vec3 x)
{
    vec3 p = vec3(floor(x.x), floor(x.y), floor(x.z));
    vec3 f = vec3(x.x - p.x, x.y - p.y, x.z - p.z);
    f = f*(f*(vec3(3., 3., 3.) - f * 2.));
    
    float n = dot(p, vec3(1.f, 57.f, 113.f));
    return mix(mix(
                     mix(hash(n +  0.f), hash(n +  1.f), f.x),
                     mix(hash(n + 57.f), hash(n + 58.f), f.x), f.y),
                mix(
                    mix(hash(n + 113.f), hash(n + 114.f), f.x),
                    mix(hash(n + 170.f), hash(n + 171.f), f.x), f.y), f.z);
}

vec3 rotate(vec3 v) 
{
    return vec3
    (
        dot(v, vec3(0.00,  0.80,  0.60)),
        dot(v, vec3(-0.80,  0.36, -0.48)),
        dot(v, vec3(-0.60, -0.48,  0.64))
    
    );
}
float fractal_brownian_motion(vec3 x)
{
    vec3 p = rotate(x);
    float f = 0.0;
    f += 0.5000*noise2(p); p = p*2.32;
    f += 0.2500*noise2(p); p = p*3.03;
    f += 0.1250*noise2(p); p = p*2.61;
    f += 0.0625*noise2(p);
    return f/0.9375;
}


// Basis function
// -------------------------------------------------------
vec3 rayDir(vec3 target, vec3 ro, vec2 uv)
{    
    // Basis
    vec3 forward = normalize(target - ro);
    vec3 right = normalize(cross(UP, forward));
    vec3 up = cross(forward, right);
    
    //
    //vec3 newUV = uv.x * right + uv.y * up;
    float focalLen = 0.7;
    vec3 newOrigin = ro + forward * focalLen;
    vec3 newUV = newOrigin + uv.x * right + uv.y * up;
    
    // Ray
    return (normalize(newUV - ro));
}

// Scene distance function
// -------------------------------------------------------
float distanceEstimator(vec3 p)
{
    float d = -fractal_brownian_motion(p* 3.4);
    float t = easeExp(timeMult * time);
    float r = SPHERE.w;
    float s = length(p - (SPHERE.xyz)) - r - (d + t);
    return s;
}

float trace(vec3 from, vec3 direction) 
{
    float totalDistance = 0.0;
    int steps;
    for (steps=0; steps < MAX_STEPS; steps++) 
    {
        vec3 p = from + totalDistance * direction;
        float distEstimate = distanceEstimator(p);
        totalDistance += 0.4 * distEstimate;
        if (distEstimate < MIN_DIST || totalDistance > MAX_DIST)
        {
            break;

        }
    }
    return totalDistance;
}

vec3 centeredDifference(vec3 p)
{
        vec3 xDir = (MIN_DIST / 10.) * vec3(1., 0., 0.);
        vec3 yDir = (MIN_DIST / 10.) * vec3(0., 1., 0.);
        vec3 zDir = (MIN_DIST / 10.) * vec3(0., 0., 1.);
        
        return normalize(
                     vec3(distanceEstimator(p+xDir)-distanceEstimator(p-xDir),
		                  distanceEstimator(p+yDir)-distanceEstimator(p-yDir),
		                  distanceEstimator(p+zDir)-distanceEstimator(p-zDir)
                         )
                        );
}

void main()
{
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy)/resolution.y;
    vec2 mouse = ( mousePos.xy - 0.5 * resolution.xy)/resolution.y;

    // Ray setup
    vec3 target = vec3(0., 0., 0.); 
    vec3 ro = vec3(0., 0., -3.);
    vec3 rd = rayDir(target, ro, uv);
    
    vec2 camAngle = vec2(0.);        
    mat2 rotateAroundY = Rotate(time);
    ro.xz *= rotateAroundY;
    rd.xz *= rotateAroundY;
    
    // Raymarch
    float t = trace(ro, rd);
    vec3 p = ro + t * rd; //  hitpoint
    
    // Lighting
    vec3 lightPos = vec3(0., 0., -5.);
    lightPos.xz *= rotateAroundY;
    vec3 l = normalize(lightPos - p);
    vec3 n = centeredDifference(p);
    float diffuse = clamp((dot(l, n)), 0., 1.);
    
    float mask = when_lt(t, MAX_DIST);
    float d = diffuse * mask;
    
    
    //float colorParam = length(p - SPHERE.xyz) - 0.4;
    float colorParam = length(p - (SPHERE.xyz)) - 0.5;
    
    vec3 col = mix(yellow, orange,   ss(0.0, 0.35, colorParam) );
    col =      mix(col,    red,      ss(0.35, 0.65, colorParam) );
    col =      mix(col,    gray,     ss(0.65, 0.75, colorParam) );
    col =      mix(col,    darkGray, ss(0.75, 1.00, colorParam) );
    col *= d;
    
    col += backgroundCol * (1. - mask);
    
    float tt = ss(0.5, BLOW_UP_TIME, 0.8 * easeExp(timeMult * time) );
    
    vec4 theCol = mix(vec4(col, 1. - tt),
                      vec4(backgroundCol, tt),
                      tt);
    // Gamma Correction
    float gamma = 2.2;
    col = pow(col, vec3(1.0 / gamma));
    
    // Output to screen
    fragColor = theCol;//vec4(col, 1.);
}`