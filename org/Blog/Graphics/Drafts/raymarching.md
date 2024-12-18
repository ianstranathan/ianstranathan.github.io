Title: Raymarching Summary
Date:  05.12.2021
Categories: Graphics
#--
*Small summary from my noodling around with raymarching*

Overview
=======================================================================================

Personal note
---------------------------------------------------------------------------------------
Shadertoy-style fragment shaders were what originally sparked my interest in computer graphics.
The main algorithm behind many of the inspiring 3D shaders you can find there is raymarching (or sphere tracing).

Shaders tend to be, euphemistically put, terse and the resources available for learning (always improving with time) have historically been sparse and irregular.
This is frustrating from a student's perspective because the most correct resources are made by working rendering engineers, but then, almost necessarily, the basics are ommited and you're left
to decypher heiroglyphically written shader code. On the other end of the spectrum, you come accross over written (I'm guilty of this myself) and/ or incorrectly derived/ explained
articles. Bridging the two is educational -- learning and experimenting on your own -- but it can also be daunting and time consuming.

Hopefully this serves as a clear explaination of raymarching and a consolidation of various resources I've collected to ease someone else's learning curve.

Motivation / Why you should care:
---------------------------------------------------------------------------------------

There are lots of good reasons to learn about signed distance rendering besides wanting to make mathematical art like me:

* Allows the creation of complex, procedural shapes (constructive solid geomety -- CSG) and 
  doesn't need analytical intersection solutions for rendering.

* A number of effects that are expensive in a normal rendering pipeline are naturally cheap in raymarching (ambient occlusion, glow, fog, shadows, instancing)

* It's interesting and can be another tool in your toolkit (you never know when you might use a technique ; see [Valve and font rendering with SDFs](https://steamcdn-a.akamaihd.net/apps/valve/2007/SIGGRAPH2007_AlphaTestedMagnification.pdf) for a creative, working example)

Signed distance function (SDF)
=======================================================================================

Definition
---------------------------------------------------------------------------------------

A signed distance function (or oriented distance function) determines the distance of a given point from the boundary of something else 
with the sign determined by whether the given point is inside or outside the boundary.

Mathematically, this is an implicit surface, i.e. an equation of the form $F\left( x, y, z \right) = 0$

With respect to a digital object we want to render, 
a signed function can be found via the distance from the ray’s current position to that object’s surface.
Conventially, the distance's expression is such that the SDF will be negative if the ray’s current position is inside the object, positive outside, or zero if it’s exactly on the surface.
It could be the other way around, you just need that trichotomy distinction.

Example
---------------------------------------------------------------------------------------

A sphere is the prototypical example:

The equation of a sphere of radius $R$ centered at the origin in cartesian coordinates:
$$x^2 + y^2 + z^2 = R^2 \implies x^2 + y^2 + z^2 - R^2 = 0$$

A field of values emerges for the coordinate space (for any $x, y, or z$) according to that implicit formula.
This can can interpreted as signifying whether you are outside, inside or on the surface of the sphere. 
(again, positive for all coordinates outside the sphere, zero for those exactly on the sphere's surface and negative for those inside the sphere )

The raymarching algorithm works with any such function and there are many geometric primitives to choose from.
Deriving these functions is one of the more interesting (mathier) components of raymarching that is not often explained.

For a reference list see [Iñigo Quilez](https://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm), the co-creator of shadertoy and influential demoscener/ mathematical artist/ rendering engineer.
Also, check out his <a href ="https://www.youtube.com/c/InigoQuilez" target="_blank">youtube channel</a> for some concrete derivations if you're interested in this stuff.

The Raymarching (Sphere Tracing) Algorithm
=======================================================================================

How does it work?
-----------------------------------------------------------------------------------------

Recall a digital scene setup (camera and object positions in some defined space creating an image frustum -- If using geometric optics in the context of computer graphics is unfamiliar, see my article on a [ray-sphere interesection](raySphereIntersection.md.html) for an introduction):

<!-- ![From Wikipedia's article on Raytracing (at the risk of over using this popular image)](../../images/raymarching/800px-Ray_trace_diagram.png) -->
<div id="center">
    <img src="../../images/raymarching/800px-Ray_trace_diagram.png">
    <p>From Wikipedia's article on Raytracing (at the risk of over using this popular image)</p>
</div>
<!-- ![$\vec{ro}$ & $\vec{s}$ are the camera's and sphere's position vectors respectively. $\vec{r}$ a given ray for a given $\vec{uv}$.The ray direction $\vec{rd}$ is the unit vector of $\vec{r}$](../../images/raySphereIntersection/sketch2.png) -->
<div id="center">
    <img src="../../images/raySphereIntersection/sketch2.png">
    <p>$\vec{ro}$ & $\vec{s}$ are the camera's and sphere's position vectors respectively. $\vec{r}$ a given ray for a given $\vec{uv}$.The ray direction $\vec{rd}$ is the unit vector of $\vec{r}$</p>
</div>


<br>
Recall the vector form of a ray (a line):
$$ \vec r = \vec {ro} + t \vec {rd} $$ 
where $t$ is the length or distance that scales a unit vector $\vec {rd}$ giving the rays direction

For a given position along the ray:
The signed distance function (this is different for each geometry) gives the distance to the surface of the object to be rendered.

If this SDF returned distance is used as our line parameter ($t$), we move forward along the ray (or march) by that same amount.
This ensures that the ray can never step past the surface of the object (for the case of a single, non-distorted primitive. Overstepping is discussed later in this article)

This process is repeated until the SDF returned distance is within an arbitrarily small threshold (it's close enough to be registered a "hit"), the raymarching loop has finished its iterations (reached it's max amount of steps, it has to end sometime), or the distance has gone
beyond some arbitrarily large threshold (it's far enough to be considered a "miss").

<!-- ![**Hit case.** Diagram from [Simon Ashbery](https://si-ashbery.medium.com/raymarching-3cdf86c637ba)](../../images/raymarching/hit.png) -->
<div id="center">
    <img src="../../images/raymarching/hit.png">
    <p>Hit case. Diagram from <a href="https://si-ashbery.medium.com/raymarching-3cdf86c637ba">Simon Ashbery</a></p>
</div>

The ray may never intersect the object: If accumulated distance goes beyond a given threshold, break out of the raymarching loop.
<!-- ![**Miss case.** Diagram from [Simon Ashbery](https://si-ashbery.medium.com/raymarching-3cdf86c637ba)](../../images/raymarching/miss.png) -->
<div id="center">
    <img src="../../images/raymarching/miss.png">
    <p>Miss case. Diagram from <a href="https://si-ashbery.medium.com/raymarching-3cdf86c637ba">Simon Ashbery</a></p>
</div>

This is the big distinction between raytracing and raymarching. Raymarching is actually a distance estimation technique as opposed to raytracing where the exact intersection points of the geometry 
(as described by a set of primitives, like triangles) and the ray are returned. 
(distance estimation tells the distance from a point to the closest object. Ray tracing finds the distance from a point to a given object along a line.)

How does it work with multiple and/or different geometries
---------------------------------------------------------------------------------------

The case of a sphere or other single primitive is clear, but what about multiple or non-primitve shapes? For example:

<!-- ![Raymarching diagram from [hvidtfeldts](http://blog.hvidtfeldts.net)](../../images/raymarching/ray.png) -->
<div id="center">
    <img src="../../images/raymarching/ray.png">
    <p>Raymarching diagram from <a href="http://blog.hvidtfeldts.net">hvidtfeldts</a></p>
</div>

Or this commonly encountered picture from GPU Gems 2:

<!-- ![Figure 8-5, [Chapter 8, GPU Gems 2](https://developer.nvidia.com/gpugems/gpugems2/part-i-geometric-complexity/chapter-8-pixel-displacement-mapping-distance-functions)](../../images/raymarching/GPUGemsRaymarching.jpg) -->
<div id="center">
    <img src="../../images/raymarching/GPUGemsRaymarching.jpg">
    <p>Figure 8-5, <a href="https://developer.nvidia.com/gpugems/gpugems2/part-i-geometric-complexity/chapter-8-pixel-displacement-mapping-distance-functions">Chapter 8, GPU Gems 2</a></p>
</div>

Naively put: How does the ray know how to step correctly? 

Well, it's embarrasing that it was confusing to me at first because it's so simple:

The ray steps according to the SDF, which if it's an exact SDF (doesn't distort the metric of the space -- preserves distances) 
is the distance to the surface of the object. Each object will have its own SDF
If we don't want the ray to accidentally step past the surface of any of the objects, we set the step size from the minimum SDF of all the objects to be rendered. 
This is what makes possible the composition of objects for unique shapes (see Constructive Solid Geometry below). 

Here are some more interactive visualizations and explainations:
Awesome interactive visualization [shader](https://www.shadertoy.com/view/4dKyRz) that makes a nod to the cannonical 
GPU Gems 2 image, or this (literally) award winning 
[explanatory shader](https://reindernijhoff.net/2017/07/raymarching-distance-fields/)

The algorithm
---------------------------------------------------------------------------------------

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ C
#define MAX_RAY_STEPS (100)
#define MAX_DIST (100)
#define MIN_DIST (0.001)

float distanceEstimator()
{
    // sdf combinations here
    return sdfCombinations;
}

float trace(vec3 from, vec3 direction) 
{
    float totalDistance = 0.0;
    int steps;
    for (steps=0; steps < MAX_RAY_STEPS; steps++) 
    {
        vec3 p = from + totalDistance * direction;
        float distEstimate = distanceEstimator(p);
        totalDistance += distEstimate;
        if (distEstimate < MIN_DIST || totalDistance > MAX_DIST)
        {
            break;
        }
    }
    return totalDistance;
}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Lighting
=======================================================================================

Calculating Normals
---------------------------------------------------------------------------------------

<!-- Finite differences gives an approximate gradient of the distance function at the point you’re sampling. In other words, 

float epsilon = 0.001; // arbitrary — should be smaller than any surface detail in your distance function, but not so small as to get lost in float precision
float centerDistance = map(p);
float xDistance = map(p + float3(epsilon, 0, 0));
float yDistance = map(p + float3(0, epsilon, 0));
float zDistance = map(p + float3(0, 0, epsilon));
float3 normal = (float3(xDistance, yDistance, zDistance) - centerDistance) / epsilon;

Note that you can improve the accuracy by taking an extra 3 samples on the other “side” of the center position and subtracting those from the first three, then dividing by 2× the epsilon value,
 but if your distance function is complicated then that can be a lot of additional work for not much visible benefit.

From Mikael Hvidtfeldt Christensen's awesome article on Raymarching:
"the common way to find the surface normal, is to sample the DE function close to the camera ray/surface intersection. 
But if the intersection point is located very close to the surface (for instance exactly on it), 
we might sample the DE inside the sphere. And this will lead to artifacts in the normal vector calculation for (1) and (3). 
So, if possible use signed distance functions. 
Another way to avoid this, 
is to backstep along the camera ray a bit before calculating the surface normal (or to add a ray step multiplier less than 1.0)." -->

Modeling Techniques:
=======================================================================================

<!-- When first defining the raymarching algorithm, the term distance estimator refered to 
a function working on a collection of objects (things with a distance function)
that returns the minimum of each object's SDF.

This brings up an interesting space to play in, namely, we can chose to return something else. -->

Constructive Solid Geometry (CSG)
---------------------------------------------------------------------------------------
<!-- 
Constructive solid geometry creates a complex surface or object by using Boolean operators (union, intersection and difference) on primitives (cylinders, prisms, pyramids, spheres, cones etc).

Image from Wikipedia article on CSG:
![Union](../../images/raymarching/Boolean_union.PNG) ![Difference](../../images/raymarching/Boolean_difference.PNG) ![Intersection](../../images/raymarching/Boolean_intersect.PNG) -->

Smooth minimum
---------------------------------------------------------------------------------------

<!-- A smooth minimum is a function that blends distance function primitives (as opposed to a simple union -- the minimum of two SDFs) to model organic shapes with raymarching.
It's a spline interpolation that makes the union of the distance functions $C^1$ continuous (you can differentiate it at least once).

Note, this returns a non-exact SDF:
"operators (like the smooth minimum here) cannot be "exact" because the very mathematics that describe them prevent it"
-Iñigo Quilez -->

My derivation of the polynomial flavor of this function can be found [here](polynomialSmin.html), if you're interested.

Domain Distortion, Repetition, Folding, 
---------------------------------------------------------------------------------------
<!-- These techniques aren't unique to raymarching, but are just as useful as in all other shader based expressions.

Domain Distortion:<br>

Domain Repetition:<br>

Domain Folding:<br> -->

Problems
=======================================================================================

Overmarching/stepping
---------------------------------------------------------------------------------------
<!-- Artifacts from overstepping are caused by 
Overstepping will either fail to render something ( it stepped completely past an object ) 
or render the inside of an object (it stepped past the surface) either way it leads to artifacts.

The raymarching/ sphere tracing algorithm is fastest when we use the largest step size possible (the shortest distance returned by the distance estimator)
but it still works if we take smaller than optimal steps, it will just take longer for the loop to resolve at a threshold distance. -->

Derivation of Geometric Primitives
=======================================================================================

Resources:
=======================================================================================

Computer graphics is a pretty deep subject and there's always more to learn even within the narrow scope of just one old school rendering algorithm that's popular in a niche subculture (demoscene)
This definitely doesn't cover everything, but hopefully it's a decent starting point for another beginner somewhere. 

Domain Repetition
---------------------------------------------------------------------------------------

* <a href="https://www.youtube.com/watch?v=s8nFqwOho-s&t=990s" target="_blank">SDF patterns talk by Johann Korndörfer (Mercury demogroup)</a>

Lists of primitives and techniques for SDFs
---------------------------------------------------------------------------------------

* [Mercury demogroup's library of signed distance functions](https://mercury.sexy/hg_sdf/) (for some motivation, check out one of their [ridiculous SDF based demos](https://www.youtube.com/watch?v=ie4u2i_5OdE) )
* [Iñigo Quilez signed distance function article](https://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm)

Lighting
---------------------------------------------------------------------------------------

* <a href="https://www.youtube.com/watch?v=FilPE91ACOA" target="_blank">Phong tips and tricks and Image based lighting in a raymarcher by Blackle Mori</a>
* [Gamma Correction article from LearnOpenGL.com](https://learnopengl.com/Advanced-Lighting/Gamma-Correction)

Overstepping
---------------------------------------------------------------------------------------
* [Art of code](https://www.youtube.com/watch?v=Vmb7VGBVZJA)
* [digitalfreepen](https://digitalfreepen.com/2017/06/21/consistent-distance-fields.html)

Visualizations:
---------------------------------------------------------------------------------------

* [Interactive Raymarching shadertoy by Trashe725](https://www.shadertoy.com/view/4dKyRz)
* [Raymarching explanatory article and shadertoy by Reinder Nihoff](https://reindernijhoff.net/2017/07/raymarching-distance-fields/)

General Tutorials
---------------------------------------------------------------------------------------

* [Scratch a Pixel's article on raymarching ](https://www.scratchapixel.com/lessons/advanced-rendering/rendering-distance-fields)
* <a href="https://www.youtube.com/watch?v=Ff0jJyyiVyw&list=PLGmrMu-IwbgtMxMiV3x4IrHPlPmg7FD-P" target="_blank">Raymarching tutorial series from the Art of Code</a>
* [Fractal focused raymarching tutorial by Mikael Hvidtfeldt Christensen](http://blog.hvidtfeldts.net/index.php/2011/08/distance-estimated-3d-fractals-ii-lighting-and-coloring/)