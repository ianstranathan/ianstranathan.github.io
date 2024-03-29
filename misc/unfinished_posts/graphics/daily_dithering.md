Title: Daily Shader: Dithering
Date: 14.01.2022
Categories: Graphics
#--
Dither is an intentionally applied form of noise used to randomize quantization error, 
preventing large-scale patterns such as color banding in images

mach banding

ordered dithering uses a precomputed matrix to transform your input image into an offset version of the same image. The values are then fed through a step function to choose the final values.

n can be any power of two

It reduces the number of colors by applying a threshold map (Bayer Matrix M) to the pixels displayed,
causing some pixels to change color depending on the distance of the original color from the available
color entries in the color pallete

add a pseudorandom value to every pixel before lowering the bits per color. 
This value is in the range equal to the loss of color precision,
which causes a correctly proportioned amount of pixels to switch over to the next color value, 
resulting in a nice looking gradient.

To get a dither, the offset can't be random, but smoothed noise.
A common and cheapt method is to use a Bayer matrix as the source for your dither values.
This is simply an infinitely repeating square lookup table, indexed by image coordinate.

Resources
=======================================================================================

* https://forums.tigsource.com/index.php?topic=40832.msg1363742#msg1363742
* https://blog.kaetemi.be/2015/04/01/practical-bayer-dithering/