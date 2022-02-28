Title: Halfway Vector
Date:  03.08.2020
Categories: Graphics
#--
*It wasn't obvious to me at first blush how the halfway vector took the expression that it did and I couldn't find a clear derivation anywhere
(Not explained on wikipedia, Peter Shirley's Fundamentals of Computer Graphics (4th edition), or Real Time Rendering (3rd edition), clearly too trivial for the wizard beards.*

Why?/Motivation:
===============================================================================================

Historically in graphics, various interpolation lighting models were used to
 produce continuous shading of surfaces represented by data associated with polygonal meshes.

By lighting model I mean a simplified, non-conserving, bidirectional reflectance model (really a smart hueristic) that just uses
 the vertex's normal, a light and viewing direction.

Each traditional shading model is named after its inventor.

If the data  of each vertex, the corners of each triangle, are interpolated (vertex to vertex, done in a vertex shader) then it's said to be Gouraud shading.
If the pixel values between vertices are interpolated (pixel to pixel, done in a fragment shader) then it's said to be Phong shading.

<!-- ![Gouraud versus Phong shading, from wikipedia](../..images/halfwayVector/PhongVersusGouraud.jpg) -->
<div id="center">
    <img src="../../images/halfwayVector/PhongVersusGouraud.jpg">
    <p>Gouraud versus Phong shading, from wikipedia</p>
</div>

This is accomplished by the internal interpolation that happens in a "varying"/ "in"/ "SV_POSITION" variables associated with this vertex.

So for example, a vertex normal would have a continuous smearing of normals, fragment to fragment. 
This can then be normalized and dotted with the viewing direction to find a diffuse shading weight.

<!-- ![Diagram from [learnwebgl.brown37.net](http://learnwebgl.brown37.net/09_lights/lights_diffuse.html)](../images/halfwayVector/learnWebGL.png) -->
<div id="center">
    <img src="../../images/halfwayVector/learnWebGL.png">
    <p>Diagram from <a href="http://learnwebgl.brown37.net/09_lights/lights_diffuse.html">learnwebgl.brown37.net</a></p>
</div>

An associated reflection vector can be found as described in [Reflection and Refraction in a Raytracer](reflectionAndRefractionInARaytracer.md.html) for approximated specular lighting.
There are also hardware accelerated functions in modern shading languages for finding the reflection vector, e.g. reflect() in glsl.

This works well for diffuse lighting as the dot product between the normal and viewing vectors will
only be ever deal with angles of 90 degrees / $\frac{\pi}{2}$ or less, but this is not the case for the reflection vector.

<!-- ![Diagram from [learnOpenGL.com](https://learnopengl.com/Advanced-Lighting/Advanced-Lighting)](../images/halfwayVector/learnOpenGL.png) -->
<div id="center">
    <img src="../../images/halfwayVector/learnOpenGL.png">
    <p>Diagram from <a href="https://learnopengl.com/Advanced-Lighting/Advanced-Lighting">learnOpenGL.com</a></p>
</div>

This is why the "halfway vector" was introduced by Jim Blinn in the Blinn-Phong lighting model.

Mathematically, the halfway vector is nothing more than an angle bisector vector with normalized components, but really it's a <b>*mapping*</b> of how oblique/ aligned with the reflection vector the viewing angle is to the angle between
it and the normal, thus recovering a better approximation/ hueristic for specular lighting.

<!-- ![Diagram from [learnOpenGL.com](https://learnopengl.com/Advanced-Lighting/Advanced-Lighting)](../images/halfwayVector/learnOpenGL2.png) -->
<div id="center">
    <img src="../../images/halfwayVector/learnOpenGL2.png">
    <p>Diagram from <a href="https://learnopengl.com/Advanced-Lighting/Advanced-Lighting">learnOpenGL.com</a></p>
</div>

Derivation
===============================================================================================

For two vectors (light direction and and viewing vector) $\vec l$ & $\vec v$
the bisecting vector between them is: $\lvert \vec v \rvert \vec l + \lvert \vec l \rvert \vec v$

See the article for [angle bisector vector](../Math/angleBisector.html) for a derivation of this expression.

If both vectors have both been normalized then this reduces to:
$\vec v + \vec l$

The halfway vector as presented in literature is just the unit version of this vector:

$$\vec H = \frac{\vec v + \vec l}{\lvert \vec v + \vec l \rvert}$$