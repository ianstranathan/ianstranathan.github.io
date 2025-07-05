;; ====================================================================================================

(defmacro doc-fn (fn)
  `(documentation
    ,(if (and (consp fn)
	      (equal (car fn) 'lambda))
	 fn
	 `#',fn)
    'function))

(defun doc-var (var-symbol)
  (documentation var-symbol 'variable))


(defun interleave (&rest lists)
  (reduce (lambda (acc x)
	    (append acc x))
	  ;; rest param provides args as a list -> apply calls func
	  ;; as if elements of the list were provided individually
	  (apply #'mapcar #'(lambda (&rest args)
			      args)
		 ;; this lambda just returns the respective cars as a list
		 lists)))

(defun split-string (string delimiter &optional (start 0))
  (let ((pos (position delimiter string :start start)))
    (if pos
	(progn (print pos)
	       (cons (subseq string start pos)
		     (split-string string delimiter (+ 1 pos))))
	(list (subseq string start)))))

;; ====================================================================================================

(defun make-link-str (ls)
  "Given a ls representing a link path (not pathname, but
   rather like an element from (ls-of-links-as-ls))
   returns a correctly formatted link"
  (format nil
	  "<a href=\"ianstranathan.com/~A\">~A</a>"
	  (format nil "~{~A/~}" ls)
	  (car (last ls))))



(defun make-p-str (name css-num)
  (format nil "<p id=\"folder_depth_~D\">~A</p>" css-num name))



(defun html-str-format-fn (ls accum-str &optional css-num)
  (let ((format-pattern (if (string-equal accum-str "")
			    "~A~A"
			    "~A~%~A")))
    (format nil format-pattern accum-str (if css-num
					     (make-p-str    (car ls) css-num)
					     (make-link-str (car ls))))))


(defun process-a-single-link-ls (ls)
  (let ((len (length ls)))
    (labels ((eater (subls &optional (accum-str ""))
	       (if subls
		   (eater (cdr subls)
			  (format-fn (car ls)
				     accum-str
				     (- len (length subls)))))
	       accum-str))
      (eater ls))))

;; recurse through a list see if there's a match of
;; any of its elements to the previous list
;; if there is a match, process from that position onward with that offset
;; (only take from the list what isn't repeating)

;; values rets -> div id & folder name
;; there should be a future time when I have multiple different dirs for
;; the same parent dir; e.g. Graphics/SDFs & Graphics/Glyphs or whatever
(defun higher-div-match? (curr-ls last-ls)
  "Recurses through a list and returns a values
   values: subseq from match onward
   see if there's a match with last-ls"
  (let ((rev-curr-ls (cdr (reverse curr-ls))))
    (labels ((recur (ls)
	       (if ls
		   ;; is there a match? From end is less work
		   (let ((div-index (position (car ls)
					      last-ls
					      :from-end t
					      :test #'equal)))
		     (if div-index ; if there's a match
			 ;; take the remaining subsequence
			 ;; with the index offset
			 (values (subseq curr-ls (+ 1 div-index)) div-index)
			 (recur (cdr ls)))))))
      (recur rev-curr-ls))))


(defun total-front-page-injection-str ()
  "returns a string representing the html for the front page
   i.e. the <p> and <a> elements for the respect folders that exists in /html"
  (labels ((eater (ls &optional (prev-ls nil)
			        (accum-str ""))
	     (if ls
		 (eater (cdr ls)
			(car ls)
			;; accumulating string
			(format nil (if (equal "" accum-str)
					'"~A~A"
					'"~A~%~A")
				accum-str
				(if (and prev-ls (higher-div-match? (car ls)
								    prev-ls))
				    (make-link-str (car ls))
				    (process-a-single-link-ls (car ls)))))
		 accum-str)))
    (eater (ls-of-links-as-ls))))
