Title: Impulse based collision simulation
Date: 02.07.2021
Categories: Projects
#--
*A Small project post mortem*
<head>
    <title>Pushing Pixels</title>
</head>
Tl;dr: Try it out <a href="../../projects\2Dphysics\refactor\index.html" target="_blank">here</a>

Overview:
=======================================================================================

Motivation
---------------------------------------------------------------------------------------
I wanted to make a simple physics "engine" (equations of motion, basic collision) as an exercise 

I was inspired to do so after watching this presentation by [Steven Witten](https://www.youtube.com/watch?v=Zkx1aKv2z8o&t=2399s)
(It's worth your time if you're interested in math or graphics. 
All his presentations, along with a host of interesting toys and articles, can be found on his incredibly polished [site](http://acko.net/))

The Gist
=======================================================================================
The fundamental idea of a physics system is very simple: incoporate the appropriate physical law (gravity, hookes law, w/e) and numerically integrate.

Pushing around pixels in practice however is hard with a capital H and this is just a simulation of frictionless colliding rigid bodies (no rotation, multiple contact point collisions, or constrained simulation)

As usual, the underpinning rendering and programming routines were all implemented from scratch (webgl, seperating axis theorem, impulse collision response, euler integration etc)

In the future, time/ interest willing, I hope to improve upon this first stab and dig deeper into the subject.

Rendering Side of Things:
---------------------------------------------------
Vanilla WebGL with some boilerplate code and glMatrix as my vector and matrix library.

* Wireframe shader via barycentric coordinates from vertices.

A glaring missing component is not setting current state of renderer from the interpolation between the two physics states. This results in some flickering artifacts.
Also, if I were to do this as a fuller project I'd like to add instancing/ batch rendering to be able to stress test the simulation.

Programming Side of Things:
---------------------------------------------------
Visualization tests or articles for each main component:

Euler integration for numerical integration to propagate motion:

* [Euler Method Article](../math/eulerMethod.md.html) 

Quad tree + circle colliders for broadphase detection & seperating axis theorem for narrow phase detection + generating contact normal for impulse

* [Impulse Based Collision Response Article](../physics/impulseBasedCollisionResolution.md.html)
* [Seperating Axis Theorem Test in p5](../../projects/2Dphysics/SATVisualization/index.html) 
* [Quadtree test in p5](../../projects/2Dphysics/quadTreeVisualization/index.html)

Resources
=======================================================================================

Fixed Timestep:
* [Glenn Fiedler](https://www.gafferongames.com/post/fix_your_timestep/)

SAT:
* <a href="https://dyn4j.org/2010/01/sat/">SAT tutorial by dyn4j</a>
* <a href="http://www.metanetsoftware.com/technique/tutorialA.html">Tutorial by n++ developer</a>

Impulse Based Collision Response:
* <a href="https://www.amazon.com/Game-Physics-Engine-Development-Commercial-Grade/dp/0123819768" target="_blank">Ian Millington - Game Physics Engine Development</a>
* <a href="https://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-the-basics-and-impulse-resolution--gamedev-6331?_ga=2.64050476.205125146.1625069373-736815224.1612468891" target="_blank">Randy Gaul - How to Create a Custom 2D Physics Engine: The Basics and Impulse Resolution</a>
* <a href="https://graphics.stanford.edu/courses/cs468-03-winter/Papers/ibsrb.pdf" target="_blank">Brian Mirtich & John Canny - Impulse-based Simulation of Rigid Bodies</a>

Quadtree:
* <a href="https://en.wikipedia.org/wiki/Quadtree#Pseudocode"> Wikipedia</a>
* <a href="https://www.youtube.com/watch?v=OJxEcs0w_kE"> The Coding Train</a>