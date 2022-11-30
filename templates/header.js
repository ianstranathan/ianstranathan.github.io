class Header extends HTMLElement
{
    constructor()
    {
	super();
	this.headerTemplate = document.createElement('template');
	this.headerTemplate.innerHTML = `
	    // <style>
//                 :host {
//                   // all: initial;
//                   // font-family: sans-serif;

// 		  --bg-col:   rgba(12%, 20%, 30%, 85%);
//                   --font-col: rgba(100%, 100%, 100%, 60%);
//                   --hover-col:rgba(100%, 100%, 100%, 100%);

//                   font-size: 1.5em;

//                   /*concatenate size all the way down*/
//                   height: 100%;
//                   width: 100%;
//                   /* background: rgba(12%, 20%, 30%, 85%) */;
// 		}

//                 #header-container{
//                   /*concatenate size all the way down*/
//                   height: 100%;
//                   width: 100%;

//                   display: flex;
//                   flex-direction: column;
//                   justify-content: flex-end;
//                   align-items: center;
//                 }
                
//                 #title-container{
//                   width: 100%;
//                   height: 50%;
//                   display: flex;
//                   flex-direction: column;
//                   justify-content: flex-end;
//                   align-items: center;
//                 }
//                 #nav-bar-container{
//                   border-top: 5px solid rgba(100%, 100%, 100%, 75%);
                  
//                   width: 60%;
//                   height: 50%;
//                 }
//                 #nav-bar{
//                   display: flex;
//                   flex-direction: row;
//                   justify-content: space-between;
//                   padding: 10px 0px 0px 0px;
//                   margin: 0px;
                  
//                 }
//                 #nav-bar li{
//                   list-style: none;
//                 }
//                 a {
//                   font-weight: 700;
//                   margin: 0 25px;
//                   color: var(--font-col);
//                   text-decoration: none;
//                 }
    
//                a:hover {
//                  color: var(--hover-col);
//                }

// */
// 	      </style>

	      <div id="header-container">
                    <div id="title-container">
                        <a href="#">IAN STRANATHAN</a>
                    </div>
		    <div id="nav-bar-container">
		      <ul id="nav-bar">
			<li><a href="about.html">¯\_(ツ)_/¯</a></li>
			<li><a href="mailto:ian@wabisoft.io"><i class="fa fa-envelope" aria-hidden="true"></i></a></li>
			<li><a href="https://github.com/stranathan"><i class="fa-brands fa-github"></i></a></li>
                        <li><a href="https://twitter.com/i_stranathan"<i class="fa-brands fa-twitter"></i></a></li>
		      </ul>
		    </div>
	      </div>
	    `;
    }

    connectedCallback()
    {
	const shadowRoot = this.attachShadow({ mode: 'closed' });

	const fontAwesome = document.querySelector('link[href*="font-awesome"]');
	if (fontAwesome)
	{
	    shadowRoot.appendChild(fontAwesome.cloneNode());
	}

	shadowRoot.appendChild(this.headerTemplate.content);
    }
}


customElements.define('header-component', Header);

