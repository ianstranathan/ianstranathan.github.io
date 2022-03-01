Title: Making a poor man's static site generator
Date:  24.02.2022
Categories: Programming
#--

Why? / Motivation
=================================================================================================================
[This first:](https://motherfuckingwebsite.com/), it's more entertaining than the post itself.

I enjoy writing. You're apparently on my website and can see that. (Try out the short stories if the
technical stuff isn't up to snuff/ your thing before leaving.)

I've always found that having some kind of scaffolding, like a technical blog post, helps a lot in clarifying
an idea and provides a means of staying accountable to the time and effort needed to learn about that idea.
Put another way, the act of writing, trying to explain minimally and clearly to another person, helps me understand a concept better and having something to show for it at the end gives me motivation to see it through.

With this in mind, I've tried to keep a technical blog for the past couple years now. I can't say how much it's helped looking in from the outside,
but the trips down the various technical rabbit holes during that time were certainly enriched by trying to coherently summarize them on my blog.

It's good practice to clean house now and then and accordingly I try to redo my resume and website once or twice a year.
I'm always keen to try to make things
a bit tidier, modular, D.R.Y'er and static site generators are an obvious choice for a personal website.
Unfortunately for me, trying to navigate software often takes as long as (and is much more frustraing than) rolling my own. 
This is, of course always a balancing act, I'm not going to ( $\implies$ am not capable of) write my own OS
or AAA Game Engine, but, while web development is definitely not my thing, converting a list of files written in markdown and making a static website out of them didn't sound too hard.

The Gist
=================================================================================================================

I'm using NodeJS to parse a bunch of files according to my own arbitrary delimiters (a small win in the sisyphean role of reinventing wheels, I don't
need to remember whatever Jekyll symbol acts as front matter, I can have my own)
I'm then using Showdown to convert the content to html and referencing front matter (title, date, categories) and file name via a JSON object
; this is used on the front end to inject everything piecemeal.

Problems
-----------------------------------------------------------------------------------------------------------------
The biggest sticking point was getting LaTeX to render correctly. Showdown was annoyingly and irregularly converting LaTeX expressions 
(e.g. some {} expressions became emphasis tags, some inline latex expresions were being broken up into seperate tags etc)

It was a good reminder that constraints, a'la occam's razor, create generally preferential solutions. I had previously been using MathJax to process
LaTeX, but while trying to find a solution, came accross Katex and it's by far the more lightweight option that matches the spirit of rolling my own static site generator.

After banging my head against the wall while unsuccessfully trying to preprocess my math expressions in the markdown file before converting the file to html (Katexshowdown node module), I just decided to roll my own solution.
I am manually parsing the .md content and wrapping each latex expression (displayed or inline) in a dummy code tag (code is not touched during
conversion via showdown), then appending its content (innerHTML) outside the dummy element on the front end (Element.insertAdjacentHTML("afterend", someInnerHtml)) and letting CSS just not display it.

Pretty Hacky, but it gets the job done.

Summary thoughts
=================================================================================================================
Was it worth it? I don't know. This is my first time really trying to make such a thing. As such, it definitely took more time than I was anticipating.
I'm not a web designer and using a Jekyll or Hugo theme would be much prettier in addition to wasting a lot less personal time.
However, you always learn a lot when doing things from scratch and you fully own whatever you make $\implies$ no more scouring the internet or docs for the right spell to cast, you just fix or extend it yourself. 

This is an intagible that is hard to quantify; I do usually
end up similarly primitve in other domains (math, graphics, physics), so something keeps me coming back for more and can't be all bad.


