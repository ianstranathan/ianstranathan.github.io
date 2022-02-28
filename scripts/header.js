var path = window.location.pathname;
var page = path.split("/").pop();
// console.log( page );

// ------------- This is to seperate header injection between main page and blog posts:
let headerLiteral;
if(page == "index.html")
{
    headerLiteral =`
    <div id="contact-bar">
        <div id="top">
            <a href="index.html"> IAN STRANATHAN</a>
        </div>

        <div id="bottom">
            <div id="about">
                <a href="#">
                    🤷‍♂️
                </a>
            </div>
            <div id="contact">
                <a href="mailto:ian@wabisoft.io"><i class="fa fa-envelope" aria-hidden="true"></i></a>
            </div>
            <div id="github">
                <a href="https://github.com/stranathan"><i class="fa fa-github" aria-hidden="true"></i></a>
            </div>
            <div id="twitter">
                <a href="https://twitter.com/i_stranathan"><i class="fa fa-twitter" aria-hidden="true"></i></a>
            </div>
        </div>
    </div>
    <div id="toggle-categories-container">
        <a href="#" id="toggle-categories-icon" onclick="toggleCategories()">
            <i id="the-toggle-icon" class="fa fa-close"></i>
        </a>
    </div>
    `
}
// need a different relative dir link to homepage
else
{
    headerLiteral =`
        <div id="contact-bar">
            <div id="top">
                <a href="../../index.html"> IAN STRANATHAN</a>
            </div>

            <div id="bottom">
                <div id="about">
                    <a href="#">
                        🤷‍♂️
                    </a>
                </div>
                <div id="contact">
                    <a href="mailto:ian@wabisoft.io"><i class="fa fa-envelope" aria-hidden="true"></i></a>
                </div>
                <div id="github">
                    <a href="https://github.com/stranathan"><i class="fa fa-github" aria-hidden="true"></i></a>
                </div>
                <div id="twitter">
                    <a href="https://twitter.com/i_stranathan"><i class="fa fa-twitter" aria-hidden="true"></i></a>
                </div>
            </div>
        </div>
        <div id="toggle-categories-container">
            <a href="#" id="toggle-categories-icon" onclick="toggleCategories()">
                <i id="the-toggle-icon" class="fa fa-close"></i>
            </a>
        </div>
    `
}

// insert header template into header id element
let header = document.getElementById("header");
header.insertAdjacentHTML("afterbegin", headerLiteral);

function toggleCategories()
{
    let categoryDiv = document.getElementById("categories");
    let tableOfContents = document.getElementById("toc_container");
    let icon = document.getElementById("the-toggle-icon");

    if(window.getComputedStyle(categoryDiv).display == "flex")
    {
        icon.className = "fa fa-bars"
        categoryDiv.style.display = "none"
        document.getElementById("content").style.width = "100%";
    }
    else
    {
        icon.className = "fa fa-close"
        categoryDiv.style.display = "flex"
        document.getElementById("content").style.width = "85%";
    }
    
}
