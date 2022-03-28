let about = document.getElementById("about");

aboutLiteral =`
<p>
    This blog exists as a personal archive for things I become interested in;
    it's like my own, budget <a href="http://hyperphysics.phy-astr.gsu.edu/hbase/hframe.html" target="_blank">Hyperphysics</a> 
    or <a href="https://www.algorithm-archive.org" target="_blank">Algorithm Archive.</a>
</p>
<h2>About</h2>
<p>
    My name is Ian. I studied Physics (B.S.) and Math (B.S) and I'm a hobbyist graphics programmer/ game developer.
</p>
<p>
    I'm motivated by understanding how things work and communicating ideas.
</p>
<p>
    I find writing serves as useful scaffolding when learning something new or cataloging a derivation and that's what
    I use this blog for.
<br>
    Unfortunately, I don't always have the time or inclination to proof read each post as thoroughly as I'd like --
    there will definitely be lots of spelling and grammar mistakes (But hopefully not too many technical mistakes). 
</p>
<p>
    Cheers & thanks for stopping by.
</p>
`
let title = document.createElement('h1');
title.style.textAlign = "center";
title.appendChild(document.createTextNode("Noodling around in Math, Physics & Computer Graphics"));
let div = document.createElement('div');

about.onclick = function displayAbout() 
{
    content.textContent = "";
    content.appendChild(title);
    content.appendChild(div);
 //   div.insertAdjacentHTML("beforeend", aboutLiteral);
    div.innerHTML = aboutLiteral;
}