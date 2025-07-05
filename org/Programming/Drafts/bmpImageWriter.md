Title: Another CPU raytracer
Date: 14.01.2022
Categories: Programming
#--
Digging into compute shaders and reimplementing something like "Raytracing in one weekend" in real time has been on the
To-Do list for a while now.

I was curious how much faster utitlizing a "modern" GPU (I'm using an RX 590, damn crypto) would be over the old oldschool
 CPU whitted raytracing

I had implemented the raytracer from "Raytracing in One Weekend" a while ago (Along with some derivaitons)
, but had since become
keenly interested in "Data oriented design" and knew it could be made faster
I'm unfortunately not Matt Godblot and can't just spin up a data oriented raytracer, so I was relegated
to slowly, painfully following Casey Muratori along until I kinda got the hang of things -- there's always so much to learn!

Getting Started
======================================================================================================
I'm working on a windows machine now, so ye olde PPM file format as used in "Raytracing in one Weekend"
isn't going to work this time (PPMs are rarely used today because they aren't compatible with standard Windows software.
Enter the bitmap image.

Speeding thing up
======================================================================================================

SIMD
------------------------------------------------------------------------------------------------------

Multithreading
------------------------------------------------------------------------------------------------------

Measuring Performance
======================================================================================================

wanted to make another small raytracer in the vein of raytracing in one weekend.


#--
I'm not a real programmer, so I can't freestyle like people like Matt Godbolt, but I have
become more than marginally interested in data oriented programming and learning some haskell is on the to do
list.
#--
I also suck at c++ and thought it would be a nice thing to make myself in the interest of greasing the c++ grove.
#--
It is remarkable how simply working on something, regardless of size or sophistication, teaches you something

* Endianness is named after a section of gulliver's travels
* Bitwise shifting to save an array of u8s
#--


---------------------------------------------------------------------------------------------------

https://web.archive.org/web/20080912171714/http://www.fortunecity.com/skyscraper/windows/364/bmpffrmt.html