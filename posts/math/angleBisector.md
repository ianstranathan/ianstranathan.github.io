Title: Vector Angle Bisector
Date:  26.08.2021
Categories: Math
#--

This is a reference derivation for the halfway vector used in the Blinn-Phong lighting model, See
[here](../../pages/Graphics/halfwayVector.html)

Given two vectors $\vec a$ and $\vec b$ with angle $\theta$ between them

let a bisecting vector be $$\xi = \lvert \lvert \vec a \rvert \rvert \vec b
            +
            \lvert \lvert \vec b \rvert \rvert \vec a
    $$

Here is a helpful [desmos visualization](https://www.desmos.com/calculator/flokdplftr)

This is rather arbitrarily presented, but if you construct it for yourself, 
you'll see the gemoetric motivation for the expression in the parallelogram it forms.

If you're satisfied by this, remembering properties of parallelograms, then you can stop here.

Algebraically showing that the angles are the same is pretty straightforward:

An expression for each of the angles (let's say $\theta_1$ is the angle between
$ \vec a $ and $\xi$ and ${\theta}_2$ is the angle between $ \vec b $ and $\xi$) can be given by the dot
product:

by definition of dot product:

$$\cos \left( {\theta}_1  \right) = \frac 
    {\vec a \cdot \vec \xi}
    {\lvert \lvert \vec a \rvert \rvert \lvert \lvert \vec \xi \rvert \rvert}$$

$$\cos \left( {\theta}_2  \right) = \frac 
    {\vec b \cdot \vec \xi}
    {\lvert \lvert \vec b \rvert \rvert \lvert \lvert \vec \xi \rvert \rvert}$$

Looking at the expression for ${\theta}_1$ and substituting in our expression for $\xi$

$$\cos \left( {\theta}_1  \right) = \frac 
    {\vec a \cdot 
     \left({\lvert \lvert \vec a \rvert \rvert \vec b
        +
        \lvert \lvert \vec b \rvert \rvert \vec a}
     \right)
    }
    {\lvert \lvert \vec a \rvert \rvert \lvert \lvert \vec \xi \rvert \rvert}
$$

$\implies$ (by properties of dot products):

$$\cos \left( {\theta}_1  \right) = \frac{\vec a \cdot \vec b \lvert \lvert \vec a \rvert \rvert + \lvert \lvert \vec b \rvert \rvert 
{\lvert \lvert \vec a \rvert \rvert}^2
}
{
\lvert \lvert \vec a \rvert \rvert \lvert \lvert \vec \xi \rvert \rvert
} 
$$

$\implies$ (simplifying):

$$\cos \left( {\theta}_1  \right) = \frac{\vec a \cdot \vec b + \lvert \lvert \vec b \rvert \rvert 
\lvert \lvert \vec a \rvert \rvert
}
{
\lvert \lvert \vec \xi \rvert \rvert
} 
$$

both original cosine expressions are identical up to swapping $\vec a$ & $\vec b$

Thus, repeating the process for ${\theta}_2$ will yield the same expression

Cosine is an even function $\implies \cos \alpha = \cos \left( -\alpha \right)$


$$\theta_1 = \theta_2$ or $\theta_1 = -\theta_2$$


Either way, they're the same scalar and our expression $\xi$ is the true bisecting vector.

---

See [proofwiki](https://proofwiki.org/wiki/Angle_Bisector_Vector) for more.