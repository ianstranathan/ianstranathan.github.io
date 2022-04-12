let content = document.getElementById("content");
let categories = document.getElementById("categories");


var theArrOfCategories = [];
var path = window.location.pathname;
var page = path.split("/").pop();
var isIndex;

if ( page == "index.html" || page == "")
{
    isIndex = true;
    initContentLinks(theArrOfCategories);
}
else
{
    // just collect the categories
    isIndex = false;
    for(let i in arrayOfPagesJSON)
    {
        if(!(theArrOfCategories.includes(arrayOfPagesJSON[i].category)))
        {
            theArrOfCategories.push(arrayOfPagesJSON[i].category);
        }
    }
}

makeCategoryLinks(theArrOfCategories);

// this makes the link elements at init for content div 
// and collects all the categories of the JSON meta data object
function initContentLinks(arrOfCategories)
{
    let arrOfDateObjects = [];

    // go through all pages and collect the relevant links
    for(let i in arrayOfPagesJSON)
    {
        datePageObj = {date: arrayOfPagesJSON[i].date.split("."), index: i}; // date data & it's respective index in the larger meta
        arrOfDateObjects.push(datePageObj);

        // this is used to for makeCategoryLinks(theArrOfCategories) for category container
        if(!(arrOfCategories.includes(arrayOfPagesJSON[i].category)))
        {
            arrOfCategories.push(arrayOfPagesJSON[i].category);
        }
    }
    
    // uses compare
    // > 0; < 0; ==
    arrOfDateObjects.sort(function (a, b)
    {
        // sort by year:
        // the string ex) 14.07.2020
        // was split by ".", so the year is the second index
        return (parseInt(b.date[2]) - parseInt(a.date[2]));
    });
    // sort by month
    arrOfDateObjects.sort(function (a, b)
    {
        // sort by year:
        // the string ex) 14.07.2020
        // was split by ".", so the year is the second index
        if(b.date[2] == a.date[2])
        {
            return (parseInt(b.date[1]) - parseInt(a.date[1]));
        }
        else
        {
            return 0;
        }
    });
    // sort by day
    arrOfDateObjects.sort(function (a, b)
    {
        // sort by year:
        // the string ex) 14.07.2020
        // was split by ".", so the year is the second index
        if(b.date[2] == a.date[2] && b.date[1] == a.date[1])
        {
            return (parseInt(b.date[0]) - parseInt(a.date[0]));
        }
        else
        {
            return 0;
        }
    });

    for(let i in arrOfDateObjects)
    {
        // make main content page links
        let div = document.createElement("div");
        div.style.display = "flex";
        div.style.flexDirection = "row";
        div.style.gap = "1%";
        let a = document.createElement('a');
        let link = document.createTextNode(arrayOfPagesJSON[arrOfDateObjects[i].index].title);
        a.appendChild(link); 
        a.appendChild(link); 
        a.title = arrayOfPagesJSON[arrOfDateObjects[i].index].title; 
        a.href = "pages/" + arrayOfPagesJSON[arrOfDateObjects[i].index].category + "/" + arrayOfPagesJSON[arrOfDateObjects[i].index].fileName; 
        div.appendChild(a);
        content.appendChild(div);
        a.insertAdjacentHTML("beforebegin", (arrayOfPagesJSON[arrOfDateObjects[i].index].date));        
    }
}

// makes a link for each category in the JSON data
// gives each link a onclick method that clears the content div and then 
// appends this to the category id element made at beginning of script
function makeCategoryLinks(arrOfCategories)
{
    for(let i in arrOfCategories)
    {
        let a = document.createElement('a');
        let link = document.createTextNode(arrOfCategories[i]);
        a.appendChild(link);
        a.title = arrOfCategories[i]; 
        a.href = "#";
        a.onclick = function changeContent() 
        {
            makeCategoryContentLinks(arrOfCategories[i]);
        }
        categories.appendChild(a);
    }
}

// function call back to each category link
// clears content div and injects the relevant links
function makeCategoryContentLinks(aCategory)
{
    // clear content
    content.textContent = '';

    let arrOfDateObjects = [];

    // go through all pages and collect the relevant links
    for(let i in arrayOfPagesJSON)
    {
        if(aCategory == arrayOfPagesJSON[i].category)
        {
            datePageObj = {date: arrayOfPagesJSON[i].date.split("."), index: i}; // date data & it's respective index in the larger meta
            arrOfDateObjects.push(datePageObj);
        }
    }
    // sort by year:
    arrOfDateObjects.sort(function (a, b)
    {
        // the string ex) 14.07.2020
        // was split by ".", so the year is the second index
        return (parseInt(b.date[2]) - parseInt(a.date[2]));
    });
    arrOfDateObjects.sort(function (a, b)
    {
        // sort by year:
        // the string ex) 14.07.2020
        // was split by ".", so the year is the second index
        if(b.date[2] == a.date[2])
        {
            return (parseInt(b.date[1]) - parseInt(a.date[1]));
        }
        else
        {
            return 0;
        }
    });
    // sort by day
    arrOfDateObjects.sort(function (a, b)
    {
        // sort by year:
        // the string ex) 14.07.2020
        // was split by ".", so the year is the second index
        if(b.date[2] == a.date[2] && b.date[1] == a.date[1])
        {
            return (parseInt(b.date[0]) - parseInt(a.date[0]));
        }
        else
        {
            return 0;
        }
    });
    // for(let i in arrayOfPagesJSON)
    // {
    //     if(aCategory == arrayOfPagesJSON[i].category)
    //     {
    //         let div = document.createElement("div");
    //         div.style.display = "flex";
    //         div.style.flexDirection = "row";
    //         div.style.gap = "1%";
    //         let a = document.createElement('a');
    //         let link = document.createTextNode(arrayOfPagesJSON[i].title);
    //         a.appendChild(link); 
    //         a.title = arrayOfPagesJSON[i].title;

    //         // if we're still on website/index.html, the link paths need to reflect that
    //         if(isIndex)
    //         {
    //             a.href = "pages/" + arrayOfPagesJSON[i].category + "/" + arrayOfPagesJSON[i].fileName; 
    //         }
    //         // otherwise we're on pages/fileName.html
    //         else
    //         {
    //             a.href = "../" + arrayOfPagesJSON[i].category + "/" + arrayOfPagesJSON[i].fileName;
    //         }

    //         div.appendChild(a);
    //         content.appendChild(div);
    //         a.insertAdjacentHTML("beforebegin", (arrayOfPagesJSON[i].date));
    //     }
    // }
    // make links and correct formatting for each sorted item using the saved index to access correct element in meta data
    for(let i in arrOfDateObjects)
    {
        let div = document.createElement("div");
        div.style.display = "flex";
        div.style.flexDirection = "row";
        div.style.gap = "1%";
        let a = document.createElement('a');
        let link = document.createTextNode(arrayOfPagesJSON[arrOfDateObjects[i].index].title);
        a.appendChild(link); 
        a.title = arrayOfPagesJSON[arrOfDateObjects[i].index].title;
        // if we're still on website/index.html, the link paths need to reflect that
        if(isIndex)
        {
            a.href = "pages/" + arrayOfPagesJSON[arrOfDateObjects[i].index].category + "/" + arrayOfPagesJSON[arrOfDateObjects[i].index].fileName; 
        }
        // otherwise we're on pages/fileName.html
        else
        {
            a.href = "../" + arrayOfPagesJSON[arrOfDateObjects[i].index].category + "/" + arrayOfPagesJSON[arrOfDateObjects[i].index].fileName;
        }
        div.appendChild(a);
        content.appendChild(div);
        a.insertAdjacentHTML("beforebegin", (arrayOfPagesJSON[arrOfDateObjects[i].index].date));
    }
}

