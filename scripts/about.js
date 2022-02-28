let about = document.getElementById("about");

aboutLiteral =`
<p>
    This blog exists as a personal archive for things I become interested in;
    it's like my own, budget <a href="http://hyperphysics.phy-astr.gsu.edu/hbase/hframe.html" target="_blank">Hyperphysics</a> 
    or <a href="https://www.algorithm-archive.org" target="_blank">Algorithm Archive.</a>
</p>
<p>
    I'm motivated by understanding how things work and communicating ideas.
    Writing serves as useful scaffolding when learning something new or cataloging a derivation.
</p>
<p>
    Unfortunately, I don't always have the time or inclination to proof read each post as thoroughly as I'd like.
    There will definitely be lots of spelling and grammar mistakes (But hopefully not too many technical mistakes). 
</p>
<p>
    Thanks for stopping by and feel free to reach out.
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
    div.insertAdjacentHTML("beforeend", aboutLiteral);
}