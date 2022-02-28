Title: Polynomial Smooth Minimum
Date:  06.05.2020
Categories: Graphics
#--

TL;DR: Live shader <a href="../../demos/sminLive.html">here</a>.

Iñigo Quilez, hallowed be his name, wrote a function for blending distance function primitives to model organic shapes with raymarching.
(for introduction to raymarching, see the article I wrote [here](raymarching.html))
He wrote a very nice article about it <a href="https://www.iquilezles.org/www/articles/smin/smin.htm">here</a>.
It's a foundational technique to get natural looking implicit surfaces which is important because nature is smooth and continuous(... that's at least what they told me in school anyway) and a simple union of two shapes is not.

"The first time you see something it's a trick, the second time it's a technique" and for anyone that is trying to learn this stuff and for whom it's still a trick, hopefully this is helpful.
I know I can only reluctantly use some derived result if I don't understand where it's coming from.

It was impossible to follow iq's derivation in his article, surely the material is just so obvious to him that the terseness with which his derivation was written wasn't intentional.
In my opinion, especially for the beginner like me, derivations are not the place for compactness, especially for something so foundational. <br>

It really gave me pause to see a couple really smart guys I follow using this function without fulling understanding it or deriving it correctly.
See: <a href="https://www.youtube.com/watch?v=Cp5WWtMoeKg&t=185s" target="_blank">Sebastian Lague</a> and
<a href="https://www.youtube.com/watch?v=YJ4iyff7zbk&t=453s" target="_blank">The Art of Code</a><br>
Both are far more productive, experienced and knowledgable than me, so maybe the real takeaway of this derivation is to choose my battles more wisely.
There is however something deeply fruitful about reinventing the wheel, despite the undeniable loss in productivity.

---

Looking at iq's article, the example of the polynomial smin seems to be getting a smooth minimum between
some decreasing exponential and a sinusoid. That seems a little hard to think about right now with it's many intersection points to account for, so let's just look at a decreasing exponential with one intersection

<div id="center">
    <img src="../../images/polynomialSmin/smin0.png">
    <p>Our functions; $f(x) = x^2$ and  $g(x) = e^{-x}$</p>
</div>

<div id="center">
    <img src="../../images/polynomialSmin/smin1.png">
    <p>The simple union of our two functions</p>
</div>

Looking at this hard minimum, we can imagine a smooth curve in its place that connects $f$ and $g$
when the functions are sufficiently close to their intersection.
But what does sufficiently close mean more precisely, $i.e$ where should the constructed function stop being $f$ and start being $g$?

<div id="center">
    <img src="../../images/polynomialSmin/smin1.png">
    <p>Our functions with their difference $d = f(x) - g(x)$</p>
</div>

Now for a reasonably useless aside:

At first blush, it's not obvious to me how to make a meaningful relationship or constraint between the two functions
beyond that they're equal to each other at their intersection. This gives us a point $C$, $d = 0$ and its mapping $x$-value

Looking at a given  $ε$  neighborhood around this point, you can see that $d$ must be on the interval $[d(x-ε), d(x+ε)]$
which are small, not necessarily identical values.

<div id="center">
    <img src="../../images/polynomialSmin/sminEpsilon.png">
</div>

Well, now we're at loss about how to generalize along this line of thinking.

And it gets worse, talking about points close to where a root of a function is requires us to know where the root is in the first place. This is a non trivial thing and a whole numerical method in its own right.
And even worse... iq's original diagram was of some flavor of a sinusoid and its intersection with a decreasing exponential has infinitely many roots. <br>
We're noping on out of here my friend, it's just too messy; we'll need to think of another relationship characteristic of proximity to the intersection.

A helpful observation is to note that this $ε$ could be made arbitrarily small, small enough to where
$[d(x-ε), d(x+ε)]$
is smaller than our original epsilon.

<div id="center">
    <img src="../../images/polynomialSmin/sminEpsilon2.png">
</div>

It's also helpful to note that the difference between two polynomials is also a polynomial and that polynomials are continuous everywhere.
So, by the intermediate value theorem, for some small value say $k$, $d∈ [-k, k]$.

"Sufficiently close" to an intersection then could be recast in terms of the difference's value instead of being near its root.

Note however that $d$ reaches $-k$ and $k$ at different rates, however slightly different, as discussed previously and if we are planning on using this interval as our generalized way to talk about being close to the intersection
our choice of $k$ will affect how the curve stiches to its base functions.
In the limit close to $C$ this doesnt matter, but for medium sized choices of $k$ I think you could play around with how $k$ changes before and after $C$ to get something more uniform or weird as you fancy.

Well, this is much nicer: we don't need to know anything about the $x$ value for a mapped zero and it's just one value, some chosen $k$.

Now that we at least have a general method of talking about being close to an intersection.
(My god, We're only on the second line of iq's derivation...)
What should the curve be in that interval?
I'm not sure there's an intelligent reason for choosing linear interpolation over something more exotic looking besides
that linear interpolation is familiar and more importantly meets our first constraint for our constructed curve/ spline thingy,
namely it must be $f$ at the beginning of "being close to the intersection” ($i.e$ at $d = -k$) and
$g$ at the end of "being close to the intersection” ($i.e$ at $d = k$).

Linear interpolation: <br>
$ξ = (1 - u)f + ug$ ;  $u ∈ [0, 1]$ <br>
So when $u = 0, ξ = f$ and $u = 0, ξ = g$

But we're not necessarily working on the interval $[0, 1]$
Thus we have to map our chosen "closeness" interval $[-k, k]$ to $[0, 1]$

Like the choice of linear interpolation, linear mapping seems easiest/ most familar:

$ℓ = mx + b$ <br>
With boundary conditions:
$ℓ(-k) = 0$ and $ℓ(k) = 1$<br>
$ℓ(-k) = -mk + b = 0, \implies b = mk$<br>
$ℓ(k) = mk + mk = 2mk = 1 \implies m = \frac{1}{2k}$ <br>
$\implies b = \frac{1}{2}$<br>
$\implies ℓ = \frac{x}{2k} + \frac{1}{2}$

but we're interpolating over the difference, not $x$

$$ℓ = \frac{d}{2k} + \frac{1}{2}$$

also, we don't want to include values outside the "sufficiently close" interval
$\implies$ we don't want to include the values when $ℓ < 0$ and $ℓ > 1$

$\implies ℓ =$ max(0, min($1$,  $ℓ$), note that this is the same as the glsl hardware accelerated function [clamp](https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/clamp.xhtml);

in glsl: $ℓ =$ clamp($ℓ$, $0$, $1$)

Just using a linear interpolation between our functions with the correctly mapped interval gives us a pretty good result:
$ξ = (1-ℓ)f + ℓg$;
$ℓ = d / {2k} + 1/2$ and $k ≈ 0.1$

<div id="center">
    <img src="../../images/polynomialSmin/firstApproxNaive.png">
    <p>As expected, our interpolated curve is equal to $f$ and $g$ when $d = -k$ and $d = k$ respectively.</p>
</div>

<div id="center">
    <img src="../../images/polynomialSmin/firstApproxWithClamp.png">
    <p>This is improved by limiting our ℓ value to only ever be between $0$ and $1$ as reasoned before</p>
</div>

What now and how do we improve on this? Well, before we go racking our brains for something more creative, what other constraints exist for our curve?<br>
Not only must ξ evaluate to $f$ & $g$ at the "closeness" interval boundaries, but since it's supposed to be smooth,
its derivative must also match the boundaries' derivatives.<br>
So what is ξ's derivative?


$$ξ = (1-ℓ)f + ℓg$$

by the product rule:

$$\frac{dξ}{dx} = \frac{d(1-ℓ)}{dx}f + \frac{df}{dx}(1-ℓ) + \frac{dℓ}{dx}g + \frac{dg}{dx}ℓ$$

$$\frac{dξ}{dx} = \frac{-dℓ)}{dx}f + \frac{df}{dx} - ℓ\frac{df}{dx} + \frac{dℓ}{dx}g + \frac{dg}{dx}ℓ$$

collecting like terms:

$$\frac{dξ}{dx} = (g - f)\frac{dℓ)}{dx} + (1 - ℓ)\frac{df}{dx} + \frac{dg}{dx}ℓ$$

Note that $g - f$ is just $-d$

Testing our first boundary: $d = -k \implies l = 0,  g - f = k$

Again $$ξ = (1-ℓ)f + ℓg, l = 0 \implies g = 0$$

$$\frac{dξ}{dx} = k\frac{dℓ)}{dx} + \frac{df}{dx}$$

We require ξ's derivative to equal the derivative of $f$ at this boundary in order to be smooth. <br>

Thus we must subtract this extra, first term from our original expression for ξ's derivative to match.

$$\implies \frac{dξ}{dx} = (g - f)\frac{dℓ)}{dx} + (1 - ℓ)\frac{df}{dx} + \frac{dg}{dx}ℓ - k\frac{dℓ)}{dx}$$

Similarly, evaluating ξ's derivative at the other boundary:

$d = k \implies l = 1,  g - f = -k$
$$\implies \frac{dξ}{dx} = (-k)\frac{dℓ)}{dx} + (0)\frac{df}{dx} + \frac{dg}{dx}ℓ - k\frac{dℓ)}{dx}$$
$$\implies \frac{dξ}{dx} = (-2k)\frac{dℓ)}{dx} + \frac{dg}{dx}ℓ$$

Again we require ξ's derivative to equal the derivative of $f$ at this boundary for smoothness.

So we must now add this extra term to our expression for ξ's derivative to match

$$\implies \frac{dξ}{dx} = (g - f)\frac{dℓ)}{dx} + (1 - ℓ)\frac{df}{dx} + \frac{dg}{dx}ℓ - k\frac{dℓ)}{dx} +2k\frac{dℓ)}{dx}$$

But now we're a bit stuck... after all, doesn't adding this term change what the ξ's derivative will evaluate to at the first boundary? <br>
Definitely, and if we were to go back and redo our process we'd be stuck in a vicious cirlce; so we need to have this second boundary corrective term disappear at the first boundary, but still be around at the second boundary.

We're in luck though; just such a term exists and has already been used by us, namely, ℓ.<br>
$ℓ$ by design is just such a term, so if we multiply this corrective term by ℓ, it will do precisely what we want it to.

$$\implies \frac{dξ}{dx} = (g - f)\frac{dℓ)}{dx} + (1 - ℓ)\frac{df}{dx} + \frac{dg}{dx}ℓ - k\frac{dℓ)}{dx} +2kℓ\frac{dℓ)}{dx}$$

Whew, that already feels like clever enough work to stop, but we want the function, not its derivative.<br>
So how to integrate this thing?

$$ξ = \int_{}^{} (g - f)\frac{dℓ)}{dx} + (1 - ℓ)\frac{df}{dx} + \frac{dg}{dx}ℓ - k\frac{dℓ)}{dx} +2kℓ\frac{dℓ)}{dx} dx$$

Regrouping terms to make the underlying product rule more obvious.

$$ξ = \int_{}^{} g\frac{dℓ)}{dx} - f\frac{dℓ)}{dx} + \frac{df}{dx} - ℓ\frac{df}{dx} + \frac{dg}{dx}ℓ - k\frac{dℓ)}{dx} +2kℓ\frac{dℓ)}{dx} dx$$

$$ξ = \int_{}^{} g\frac{dℓ)}{dx} + \frac{dg}{dx}ℓ - \left(f\frac{dℓ)}{dx} + ℓ\frac{df}{dx}\right) + \frac{df}{dx} - k\frac{dℓ)}{dx} +2kℓ\frac{dℓ)}{dx} dx$$

reversing the product rule on the first two terms or integrating by parts and integrating the last three, straightforward integrals

$$ξ = gℓ - fℓ + f - kℓ + kℓ^2$$

$$\implies ξ = (1 - ℓ)f + ℓg - kℓ(1 - ℓ)$$

This is exactly iq's function ([mix](https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/mix.xhtml) is glsl hardware accelerated linear interpolation)

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ C
// polynomial smooth min (k = 0.1);
float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);    
}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

<div id="center">
    <img src="../../images/polynomialSmin/sminFinal.png">
    <p>Our smooth minimum</p>
</div>


Wrapping Up:


This was a little dive into shader flavored spline interpolation; we took a nice result from an authoritative source and rederived it from first principles.
The function itself, as said by iq, is only $C^1$ continous, but we could extend this with our same approach to be whatever order continuous we like at the expense of performance.
Shaders are performance sensitive and the first order polynomial smin is what you mostly see perusing shadertoy.

Live shader can be found <a href="../../demos/sminLive.html">here.</a>

If you're curious how I made this shader, the big picture is that I'm using the "over operator" to make a graph of functions which is a really common technique, see <a href="https://thebookofshaders.com/05/">this well known resource </a> for more on that.
Additionally, I am using a handmade easing function that is interpolating over the functions' derivatives' values to make the lines more uniform  with some functional conditionals to help out.<br>

Shader code can be found <a href="https://github.com/Stranathan/glslFun/blob/master/sminArticle.glsl"> here </a>

Hopefully it's helped someone besides me. Thank you for reading.


