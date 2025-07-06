;;;; Super simple (i.e. personal) SSG written in common lisp
;;;; Besides the last version being bad enough/ unmaintainable enough to warrant a rewrite
;;;; Goals:
;;;; - everything is in portable lisp (no poor reimplementations of existing standards)
;;;; - focus on minimal functional transforms instead, no complicated state changes
;;;; - keep things dumb (no decision making on my end about where things are supposed to start)
;;;;   
;;;; See notes.org in same folder for more
;;;;
;;;; Usage: Called in same script as the elisp, org to html conversion script
;;;;        after conversion, this just injects subject categories & links and on homepage
;;;;        to reflect the directory / subject heirarchy
;;;; 
;;;; Dependencies: uiop (comes included with SBCL)
;;;;
;; ====================================================================================================
;; p is a pathname object, ls is a list type

(defun html-p (p) ; p is  pathname 
  (equal "html" (pathname-type p)))

(defun html-filter (ls) ; ls is a list
  (remove-if-not (lambda (x)
		   (html-p x))
		 ls))

(defun collect-index-files ()
  ;; script always spins up in the same directory as src
  ;; default pathname is always where the elisp fires script
  ;; merging ../html with this gets us to the html folder (where everything was exported)
  ;; after that it's just recursing through for the index files
  (let ((root (merge-pathnames "../html/" *default-pathname-defaults*)))
    (labels ((single-dir-fn (p accl)
	       (list-of-dirs-fn (uiop:subdirectories p)
				(append accl (html-filter (uiop:directory-files p)))))
	     ;; -- 
	     (list-of-dirs-fn (ls accl)
	       (if (null ls)
		   accl
		   (single-dir-fn (car ls)
				  (list-of-dirs-fn (cdr ls)
						   accl)))))
      (single-dir-fn root nil))))


(defun remove-substring (str substr
			 &key (keep-first-half nil) (keep-second-half nil))
  
  (let* ((substring-index (search substr str :test #'equal))
	 (first-half  (subseq str 0 substring-index))
	 (second-half (subseq str substring-index)))
			      ;; (+ (length substr) substring-index))))
    (assert (typep substring-index 'number)
	    (substring-index)
	    "The substring you tried wasn't found")
    (cond (keep-first-half
	   first-half)
	  (keep-second-half
	   second-half)
	  (t
	   (concatenate 'string first-half (subseq second-half (length substr)))))))


(defun site-relative-strs (&optional no-index
			             no-root
			             is-hosted-from-generated-folder)
  "
  Returns lists of all index files as formated strings
  (relative to where site is hosted, i.e. html folder)
  most of the LOC here are just for accomodating
  optional formatting (no-index, no-root)


  It's probably best to remove is-hosted-from-generated-folder
  other functions (namely, process-pages) are assuming that there's it's not being
  deployed from /html
  "
  (let ((_files (collect-index-files))
	(site-root-str "/ianstranathan.github.io" ))
    (labels ((to-where-site-is-hosted-fn (p)
	       ;; if site dumps to /html folder (deployed from this folder)
	       ;; hosted from this folder, so html needs to be removed
               ;; cut str to where site starts
	       (if is-hosted-from-generated-folder
		   (remove-substring (remove-substring (namestring p)
						       site-root-str
						       :keep-second-half t)
				     "/html")
		   (remove-substring (namestring p)
				     site-root-str
				     :keep-second-half t)))
	     (no-index-fn (p)
	       (remove-substring (to-where-site-is-hosted-fn p)
				 "index.html"))
	     (no-root-fn (p)
	       (remove-substring (to-where-site-is-hosted-fn p)
				 site-root-str))
	     (no-root-&-no-index-fn (p)
	       (remove-substring (no-index-fn p)
				 site-root-str)))
      (cond ((and no-index no-root)
	     ;; removing the first string which is just "/" since the root was removed
	     (cdr (mapcar #'no-root-&-no-index-fn _files))) 
	    (no-root  (mapcar #'no-root-fn _files))
	    (no-index (mapcar #'no-index-fn _files))
	    (t        (mapcar #'to-where-site-is-hosted-fn _files))))))


(defun path-str-as-ls (s)
  (remove "" (uiop:split-string s :separator "/")
	  :test #'equal))


(defun ls-of-links-as-ls ()
  "reverse -> to undo the recursive cdr to correct alphabetical
   order / foler order"
  (mapcar #'path-str-as-ls (site-relative-strs t t)))


(defun higher-div-sublist? (curr-ls last-ls)
  (labels ((fn (a b)
	     (if a
		 (let ((matching-subls (member (car a) b :test #'equal)))
		   (or matching-subls
		       (fn (cdr a) b))))))
    (fn (reverse curr-ls) last-ls)))


(defun category-formatting-ls (ls)
  "formats list of all site pages/ index files/ links or whatever
   to remove repeating sublists / redudant folder heirarchy"
  (maplist #'(lambda (sublist)
			(let ((curr-ls (car (cdr sublist)))
			      (last-ls (car sublist)))
			  (or (cdr (higher-div-sublist? curr-ls last-ls))
			      last-ls)))
		    ls))
					  

(defun make-link-element (link-name link-path-ls)
  (format nil 
	  ;; "<a href=\"ianstranathan.com/~A\">~A</a>"
	  "<a href=\"~A\">~A</a>"
	  (format nil "~{~A/~}" link-path-ls)
	  link-name))


(defun make-p-element (elem-name link-path-ls)
  ;; position has to be offset by one to account for the /html folder
  (format nil 
	  "<p id=\"folder_depth_~D\">~A</p>"
	  (- (position elem-name link-path-ls :test #'equal) 1)
	  elem-name))


(defun process-pages-ls ()
  "two lists: the formatted ls, i.e. repeating categories are removed
              full ls, i.e list whose elements represent the actual link
   --> this is removing the html as the first element in the formatted links
  (mapcar #'(lambda (x)
             (cdr x))
          list-of-pages)
  " 
  (let* ((list-of-pages (ls-of-links-as-ls))
	 (formatted-ls (category-formatting-ls (mapcar #'(lambda (x)
							   (cdr x))
							   list-of-pages)))
         (full-ls      list-of-pages))
    (mapcar #'(lambda (formatted-ls-elem
		       full-ls-elem)
		(mapcar #'(lambda (x)
			    ;; if x is the link, i.e. last element
			    ;; make a link with the full path
			    (if (equal x (car (last formatted-ls-elem)))
				(make-link-element x full-ls-elem)
				(make-p-element x full-ls-elem)))
			formatted-ls-elem))
	    formatted-ls
	    full-ls)))
		

(defun format-front-page-html-str ()
  "process-pages-ls: transformed links with the respective <p> and <a> formatting
   this just iteratively formats it all together"
    (format nil "~{~{~A~%~}~}" (reverse (process-pages-ls))))


(defun inject-into-homepage ()
  (let* ((p (merge-pathnames "../html/index.html" *default-pathname-defaults*));;(p (merge-pathnames "../html/index.html" *default-pathname-defaults*))
	 (homepage-content-str (uiop:read-file-string p))
	 (content-div-str "<div id=\"content\" class=\"content\">")
	 (to-content-index (search content-div-str
				   homepage-content-str
				   :from-end t
				   :test #'equal))
	 (to-content (subseq homepage-content-str
			     0 
			     (+ (length content-div-str)
				to-content-index)))
	 (to-end (subseq homepage-content-str (search "</div>"
					      homepage-content-str 
					      :test #'equal
					      :start2 to-content-index))))
    (with-open-file (stream p :direction :output :if-exists :supersede)
      (format stream     ; where it's being written to (e.g. t -> default, nil -> string etc)
	      "~A~%~A~A"
	      to-content
	      (format-front-page-html-str)
	      to-end))
    (format t "~%~A~%" "Injected links into homepage!")))


(inject-into-homepage)
(format t "~%~A~%" "Exiting from script!")
(exit)

