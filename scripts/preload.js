//  __dirname in a node script returns the path of the folder where the current JavaScript file
// __filename and __dirname are used to get the filename and directory name of the currently executing file.
// ./ gives the current working directory wherever that may be during run time
// path.join(__dirname, 'test')

//-----------------------------------------------------------
// BRAIN DUMP
// check to see if readfile data needs to be made into a string for html concatenation
//-----------------------------------------------------------

// NodeJS Settings
//-----------------------------------------------------------
const fs = require('fs');
const showdown = require('showdown');

// const path = require('path');
// const { callbackify } = require('util');

// get posts' subdirectories
let categoryDirs = fs.readdirSync("../posts"); // array of all the different categorized posts

// get template html
let blogHtmlTemplate = String(fs.readFileSync("../html/blogPost.html"));

// make a pages directory to store converted markdown
fs.mkdirSync("../pages");
//console.log(fs.existsSync("../pages"));

let arrayOfPageObjects = []; // array of header/meta data for JSON to use in client side script

for(let i in categoryDirs)
{
    let filesInSubDir = fs.readdirSync("../posts/" + categoryDirs[i]); // array of all the markdown files in dir

    // go through each file in the category subdirectory
    for(let j in filesInSubDir)
    {

        // content of each markdown post
        let data = String(fs.readFileSync("../posts/" + categoryDirs[i] + "/" + filesInSubDir[j]));

        // parse the markdown content according to whatever delimiter --> #--
        let pageObject = {fileName: filesInSubDir[j].split(".").shift() + ".html", title: "", date: "", category: ""};
        // I don't want to store content in JSON string, not readable --> just put it somewhere else          
        let temporaryContent = {content: ""}; // objects and arrays pass by reference
        parsePostFile(data, pageObject, temporaryContent); // is the data not already of type string?
        
        // Make the post category dir for pages
        if(!(fs.existsSync("../pages/" + pageObject.category)))
        {
            fs.mkdirSync("../pages/" + pageObject.category);
        }

        arrayOfPageObjects.push(pageObject);
        // convert each markdown file to html
        let converter = new showdown.Converter();
        let htmlData = converter.makeHtml(temporaryContent.content);
        let blogHtml = blogHtmlTemplate.replace(`<div id="content">`, `<div id="content">` + htmlData);

        fs.writeFileSync("../pages/" + pageObject.category + "/" + pageObject.fileName, blogHtml);
    }
}

// after all html pages have been made, make JSON data for use on client side to reference them.
fs.writeFileSync("metaStuff.js", "var arrayOfPagesJSON = " + JSON.stringify(arrayOfPageObjects));

// JSON for client side scripts
//fs.writeFile("metaStuff.js", "var arrayOfPagesJSON = " + JSON.stringify(arrayOfPageObjects));

/*---------------------------------------------
    This requires a markdown file that is formatted to
    seperate header/meta data by the delimiter: #--
    example:

    Title: Dithering
    Date:  14.01.2022
    Categories: Graphics
    #--
    Content                               
/*---------------------------------------------*/
function parsePostFile(thePost, pageObject, tmpContent)
{
    var postArr = thePost.split("#--");
    let headMatter = postArr[0];

    let titleSubStr = "Title: ";
    let titleSubStrLen = titleSubStr.length;
    let titleSubStrIndex = headMatter.indexOf(titleSubStr);
    let title = "";
    let dateSubStr = "Date: ";
    let dateSubStrLen = dateSubStr.length;
    let dateSubStrIndex = headMatter.indexOf(dateSubStr);
    let date = "";
    let categoriesSubStr = "Categories: ";
    let categoriesSubStrLen = categoriesSubStr.length;
    let categoriesSubStrIndex = headMatter.indexOf(categoriesSubStr);
    let categories = "";

    // headmatter[0] = ""
    // headmatter[last] = ""
    for(let i = titleSubStrIndex + titleSubStrLen; i < headMatter.length - 1; i++)
    {
        if( i < dateSubStrIndex)
        {
            title += headMatter[i];
        }
        else if(i >= dateSubStrIndex + dateSubStrLen && i < categoriesSubStrIndex)
        {
            date += headMatter[i];
        }
        else if(i >= categoriesSubStrIndex + categoriesSubStrLen)
        {
            categories += headMatter[i];
        }
    }

    pageObject.title = title.trim();
    //console.log(pageObject.title);
    pageObject.date = date.trim();
    //console.log(pageObject.date);
    pageObject.category = categories.trim();
    //console.log(pageObject.categories);

    // preprocess latex
    tmpContent.content = preprocessLatex(postArr[1]).trim();
}

// wrap up all expression of $$ $$ & $ $ into their own elements
// done quickly, indices might be out of bounds
function preprocessLatex(immutableContentString)
{
    let processedContent= ""
    let expressionStarted = false;
    let index = 0;
    while(index < immutableContentString.length)
    {
        if(immutableContentString[index] == "$" && expressionStarted == false)
        {
            expressionStarted = true;
            // case 1: $$
            if(immutableContentString[index + 1] == "$")
            {
                processedContent += "<code class='latexWorkaround'>" + immutableContentString[index] + immutableContentString[index + 1];
                index += 2;
            }
            // case 2: $
            else
            {
                processedContent += "<code class='latexWorkaround'>" + immutableContentString[index];
                index += 1;
            }
        }
        else if(immutableContentString[index] == "$" && expressionStarted == true)
        {
            // case 1: $$
            if(immutableContentString[index + 1] == "$")
            {
                processedContent += immutableContentString[index] + immutableContentString[index + 1] + "</code>";
                index += 2;
            }
            // case 2: $
            else
            {
                processedContent += immutableContentString[index] + "</code>";
                index += 1;
            }
            expressionStarted = false;
        }
        else
        {
            processedContent += immutableContentString[index];
            index++;
        }
    }
    // console.log('\x1b[36m%s\x1b[0m', immutableContentString);
    // console.log(processedContent);
    
    return processedContent;
}
