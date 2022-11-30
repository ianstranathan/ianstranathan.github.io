class Footer extends HTMLElement
{
    constructor()
    {
	super();
	this.footerTemplate = document.createElement('template');
	this.footerTemplate.innerHTML = `
	    <style>
                #footer-container{
                font-size: 0.6em;
                }
	    </style>

	    <div id="footer-container">
                <p>©Ian Stranathan 2022</p> 
	    </div>
	    `;
    }

    connectedCallback()
    {
	const shadowRoot = this.attachShadow({ mode: 'closed' }); // inaccessible from external javascript

	const fontAwesome = document.querySelector('link[href*="font-awesome"]');
	if (fontAwesome)
	{
	    shadowRoot.appendChild(fontAwesome.cloneNode());
	}

	shadowRoot.appendChild(this.footerTemplate.content);
    }
}


customElements.define('footer-component', Footer);

