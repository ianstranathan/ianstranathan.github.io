const header_literal = `
<body>
  <header>
   <h1> <a href="../../../">Ian Stranathan </a></h1>
    <p> Noodling around: Graphics | Game Development | Physics | Math <p>
    <nav>
      <ul>
	<li><a href="../../Misc/about/"><i class="fa-regular fa-address-card"></i></a></li>
	<li><a href="mailto:ian@wabisoft.io"><i class="fa fa-envelope" aria-hidden="true"></i></a></li>
	<li><a href="https://github.com/stranathan"><i class="fa-brands fa-github"></i></a></li>
      </ul>
    </nav>
  </header>`;

const head_literal = `
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>`

const footer_literal = `</main>
  <footer>
      <p>©Ian Stranathan 2022</p> 
  <footer>
</body>`;

// --------------------------------------------------
const fs = require('fs'),
      pages_path = "../pages/",
      posts_path = "../posts/",
      template_path = "../templates/"
      character_encoding_format = "utf8";

const posts_dir = fs.readdirSync(posts_path, character_encoding_format),
      pages_dir = fs.readdirSync(pages_path, character_encoding_format);

// --------------------------------------------------
const concatenate_file_path = x => y => z => x + "/"+ y + "/" + z;


function write_index_file(){

    // ------------------------------------------------------------
    
    main_template = fs.readFileSync(template_path + "main.html", character_encoding_format);
    let end_main_loc   = main_template.indexOf("</main>"); 
    let start_main_str = main_template.slice(0, end_main_loc);
    let end_main_str   = main_template.slice(end_main_loc);
    main_page_links = "";

    // ------------------------------------------------------------
    for ( category_dir of pages_dir ){	
	articles_dir = fs.readdirSync(pages_path + category_dir)
	file_path_func = concatenate_file_path(pages_path + category_dir);
	link_path_func = concatenate_file_path("pages/" + category_dir); // links are relative to root dir

	category_links = ("<p></p><span>" + category_dir + "</span>");
	for( article_dir of articles_dir){

	    // -- collect links to inject into root index file | here to save double looping
	    let link = article_dir != "about"? make_link_from_path("pages/" + category_dir + "/" + article_dir, from_snake_case_to_normal(article_dir)) : '';
	    category_links = category_links.concat(link).concat("\n")
	    
	    // -- inject header and footer into posts
	    if(fs.existsSync(file_path_func(article_dir)("org.html"))){
		fs.writeFileSync(file_path_func(article_dir)("index.html"),
				 // if options is a string, then it specifies the encoding.
				 concat_file(fs.readFileSync(file_path_func(article_dir)("org.html"), character_encoding_format)));
	    }
	    else{
		let tmp = fs.readFileSync(file_path_func(article_dir)("index.html"), character_encoding_format);
		
		fs.renameSync(file_path_func(article_dir)("index.html"), // keep copy of org output for checking
		              file_path_func(article_dir)("org.html"));
		fs.writeFileSync(file_path_func(article_dir)("index.html"),
				 concat_file(tmp));
	    }
	    
	    // console.log(file_path_func(article_dir)("index.html"));
	    // console.log( make_link_from_path(link_path_func(article_dir)("index.html"), from_snake_case_to_normal(article_dir)));
	    // console.log("------------------------------");
        }

	main_page_links = main_page_links.concat(category_links).concat("\n")
    }

    // --------------------------------------------------

    fs.writeFileSync("../index.html",
		     start_main_str + main_page_links + end_main_str);
}

write_index_file()

function make_link_from_path(path_str, name){
    return '<a href="'.concat(path_str).concat('">').concat(name).concat('</a>');
}

// --------------------------------------------------

function from_snake_case_to_normal(s){
    let words = s.split("_").map(
        x => x.charAt(0).toUpperCase() + x.slice(1)
        );
    return words.join(" ");
}

function concat_file(file_str){
    return concat_footer( concat_content( concat_header( concat_head( "", file_str), file_str), file_str), file_str);
}

function concat_head(concat_file_str, file_str){
    concat_file_str += (file_str.slice(0, file_str.indexOf("</head>"))
			+
			head_literal);
    return concat_file_str;
}
function concat_header(concat_file_str, file_str){
    concat_file_str += header_literal;
    return concat_file_str;
}

function concat_content(concat_file_str, file_str){
    concat_file_str += file_str.slice(file_str.indexOf('<div id="content">'), file_str.indexOf('</body>'));
    return concat_file_str;
}

function concat_footer(concat_file_str, file_str){
    concat_file_str += footer_literal;
    return concat_file_str; 
}
