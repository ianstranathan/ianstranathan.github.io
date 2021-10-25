var bombGuyVS = `#version 300 es

precision highp float;

layout (location=0) in vec3 vertexPos;

void main()
{
    gl_Position =  vec4(vertexPos, 1.0);
}
`

var bombGuyFS = `#version 300 es

precision highp float;

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;
uniform vec2 mousePos;

// Constants
#define PI (3.14159)

// Raymarching params
#define MAX_STEPS (120)
#define MIN_DIST  (0.001)
#define MAX_DIST  (100.0)

// Function macros
#define ss smoothstep
#define UP vec3(0., 1., 0.)

// Misc.
#define SPHERE vec4(0., 0., 0., 1.5)
#define spikeHeight 0.7
#define spikeParam vec2(1., 0.7)

// Colors
#define black vec3(0.1)
#define backCol vec3(.9, .9, .35) * 0.7
#define gray vec3(0.3)


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

// SDFs
// -------------------------------------------------------
float sdCone( vec3 p, vec2 c, float h )
{
  float q = length(p.xz);
  return max(dot(c.xy,vec2(q,p.y)),-h-p.y);
}

// Scene sdfs
// -------------------------------------------------------
float distanceEstimator(vec3 p)
{
    //vec2 mouse = ( mouse.xy - 0.5 * resolution.xy)/resolution.y;
    float s0 = length(p - SPHERE.xyz) - 1.1;
    
    float s1 = sdCone(abs(p) - vec3(0, SPHERE.w, 0.), spikeParam, spikeHeight);
    vec2 tmp = Rotate(PI / 2.) * vec2(p.x, p.y);
    vec3 s2p = vec3(tmp.x, tmp.y, p.z);
    float s2 = sdCone(abs(s2p) - vec3(0, SPHERE.w, 0.), spikeParam, spikeHeight);

    tmp = Rotate(PI / 2.) * vec2(p.y, p.z);
    vec3 s3p = vec3(p.x, tmp.x, tmp.y);
    float s3 = sdCone(abs(s3p) - vec3(0, SPHERE.w, 0.), spikeParam, spikeHeight);
    
    float u1 = min(s0, s1);
    float u2 = min(u1, s2);
    float u3 = min(u2, s3);
    return u3;
}

// Raymarch
// -------------------------------------------------------
float trace(vec3 from, vec3 direction) 
{
    float totalDistance = 0.0;
    int steps;
    for (steps=0; steps < MAX_STEPS; steps++) 
    {
        vec3 p = from + totalDistance * direction;
        float distEstimate = distanceEstimator(p);
        totalDistance += 0.25 * distEstimate;
        if (distEstimate < MIN_DIST || totalDistance > MAX_DIST)
        {
            break;

        }
    }
    return totalDistance;
}

// Finite difference function
// -------------------------------------------------------
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

float blinnPhong(vec3 p, vec3 ro, vec3 n, vec3 lightPos)
{
    // ambient
    //vec3 ambient = 0.01 * color;
    float ambient = 0.08;
    // diffuse
    vec3 lightDir = normalize(lightPos - p);
    vec3 normal = normalize(n);
    float diffuse = max(dot(lightDir, normal), 0.0);

    // specular
    vec3 viewDir = normalize(ro - p);
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = 0.0;
    
    vec3 halfwayDir = normalize(lightDir + viewDir);  
    spec = pow(max(dot(normal, halfwayDir), 0.0), 64.0);
    
    float specular = 0.5 * spec;
    return (ambient + diffuse + specular);
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

void main()
{
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy)/resolution.y;
    //vec2 mouse = ( mouse.xy - 0.5 * resolution.xy)/resolution.y;

    // Ray setup
    vec3 target = vec3(0., 0., 0.); 
    vec3 ro = vec3(0., 0., -3);
    vec3 rd = rayDir(target, ro, uv);
    
    mat2 rotateAroundY = Rotate(0.7 * time);
    mat2 rotateAroundX = Rotate(PI * (-1.0 / 6.0) * sin(0.6 * time));
    
    ro.yz *= rotateAroundX;
    ro.xz *= rotateAroundY;
    rd.yz *= rotateAroundX;
    rd.xz *= rotateAroundY;
    
    // Raymarch
    float t = trace(ro, rd);
    vec3 p = ro + t * rd; //  hitpoint
    
    // Lighting
    vec3 lightPos = vec3(0., 0., -5.);
    lightPos.yz *= rotateAroundX;
    lightPos.xz *= rotateAroundY;
    vec3 l = normalize(lightPos - p);
    vec3 n = centeredDifference(p);
    float diffuse = clamp((dot(l, n)), 0., 1.);
    
    
    float colorParam = length(p - (SPHERE.xyz));
    float boundary = when_lt(colorParam, 1.13); // see scene sdf
    vec3 bombCol = boundary * black;
    vec3 spikeCol = 1. - boundary * vec3(1.); 
    
    vec3 blendedCol = mix(bombCol, spikeCol, ss(1.13, 1.131, colorParam));
    
    float shapeMask = 1. - when_lt(t, 5.);

    vec3 col = backCol * shapeMask + 
               (1. - shapeMask) * blinnPhong(p, ro, n, lightPos) *( blendedCol);
    
    // Gamma Correction
    float gamma = 2.2;
    col = pow(col, vec3(1.0 / gamma));
    
    // Output to screen
    fragColor = vec4(col, 1.);
}`