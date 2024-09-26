;; html as a folder name should be made into a variable (maybe I'll change it to 'site' or 'build'

;;<link rel=\"icon\" href=\"http://example.com/favicon.png\">

;;(defvar icon-url "https://ianstranathan.github.io/../img/hello.ico"

;; Load the publishing system
(require 'ox-publish)

;; ----------------------------------------------------------------------------------------------------
;; Customize the HTML output
(setq org-html-validation-link nil            
      org-html-head-include-scripts nil       ; Use our own scripts
      org-html-head-include-default-style nil ; Use our own styles)
      org-html-head "<meta charset=\"UTF-8\">
<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
<meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\">
<title>Blah</title>
<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css\" integrity=\"sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A==\" crossorigin=\"anonymous\" referrerpolicy=\"no-referrer\">
<link rel=\"stylesheet\" href=\"https://cdn.simplecss.org/simple.min.css\">
<style>

#preamble > header {
    background-color: var(--accent-bg);
    border-bottom: 1px solid var(--border);
    text-align: center;
    /*top, right, bottom, left*/
    /*padding: 0 0.5rem 2rem 0.5rem; */
    grid-column: 1 / -1;
}

#preamble > header > *:only-child {
    margin-block-start: 2rem;
}

#preamble > header h1 {
  max-width: 1200px;
  margin: 1rem auto;
}

#preamble > header p {
  max-width: 40rem;
  margin: 1rem auto;
}

#content{
    display: flex;
    flex-direction: column;
}

#content > span{
    padding-top: 7px;
}

#postamble > footer {
    margin-top: 4rem;
    padding: 2rem 1rem 1.5rem 1rem;
    color: var(--text-light);
    font-size: 0.9rem;
    text-align: center;
    border-top: 1px solid var(--border);
}
#categories{
display: flex;
flex-direction: column;
  align-items: center;
  justify-content: center;
}
.dir{
	  width: fit-content;
	  border-radius: 10px;
	  background-color: rgb(25, 25, 25);
          padding: 2%;
          margin: 1%;
      }
.dir h3 {
	  text-align: center;
	  padding: 0;
	  padding-bottom: 7px;
	  margin: 0;
      }
</style>"
      org-html-mathjax-template
      "<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.min.css\" integrity=\"sha384-9eLZqc9ds8eNjO3TmqPeYcDj8n+Qfa4nuSiGYa6DjLNcv9BtN69ZIulL9+8CqC9Y\" crossorigin=\"anonymous\"/>
<script defer=\"defer\" src=\"https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.min.js\" integrity=\"sha384-K3vbOmF2BtaVai+Qk37uypf7VrgBubhQreNQe9aGsz9lB63dIFiQVlJbr92dw2Lx\" crossorigin=\"anonymous\"></script>
<script defer=\"defer\" src=\"https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/contrib/auto-render.min.js\" integrity=\"sha384-kmZOZB5ObwgQnS/DuDg6TScgOiWWBiVt0plIRkZCmE6rDZGrEOQeHM5PcHi+nyqe\" crossorigin=\"anonymous\" onload=\"renderMathInElement(document.body);\"></script>"

      org-html-preamble
      "<header>
      <h1> Ian Stranathan </h1>
      <p> Noodling around: Graphics | Programming | Game Dev | Physics | Math </p>
	</p><nav>
	  <ul>
	    <li><a href=\"mailto:email@ianstranathan.com\"><i class=\"fa fa-envelope\" aria-hidden=\"true\"></i></a></li>
	    <li><a href=\"https://github.com/ianstranathan\"><i class=\"fa-brands fa-github\"></i></a></li>
            <li><a href=\"https://ianim.itch.io/\"><i class=\"fa-brands fa-itch-io\"></i></a></li>
	  </ul>
	</nav>
    </header>"
      org-html-postamble "<footer><p>©Ian Stranathan <script>document.write(new Date().getFullYear())</script></p></footer>")


;; Define the publishing project
(setq org-publish-project-alist
      (list
       (list "org-site:main"
             :recursive t
	     :exclude ".*/drafts/.*"
             :base-directory "../org"
             :publishing-function 'org-html-publish-to-html
             :publishing-directory "../html"
             :with-author nil
             :with-toc nil
	     :with-title t              ; If nil, title still appears in tab
             :section-numbers nil       ; Don't include section numbers
             :time-stamp-file nil)))    ; Don't include time stamp in file

(delete-directory  "../html" t)

;; Generate the site output
(org-publish-all t)

(shell-command "sbcl --load html-injection.lisp")

(copy-directory "../rsc" "../html/")

