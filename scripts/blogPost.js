let content = document.getElementById("content");
let categories = document.getElementById("categories");

let theArrOfCategories = []; // kinda bad, this is made once



getCategories(theArrOfCategories);
makeCategoryLinks(theArrOfCategories);

function getCategories(arrOfCategories)
{
    for(let i in arrayOfPagesJSON)
    {
        // make category page links
        if(!(arrOfCategories.includes(arrayOfPagesJSON[i].category)))
        {
            console.log(theArrOfCategories);
            arrOfCategories.push(arrayOfPagesJSON[i].category);
        }
    }
}

function makeCategoryContentLinks(aCategory)
{
    for(let i in arrayOfPagesJSON)
    {
        if(aCategory == arrayOfPagesJSON[i].category)
        {
            // make main content page links
            let a = document.createElement('a');
            let link = document.createTextNode(arrayOfPagesJSON[i].date + " " + arrayOfPagesJSON[i].title);
            a.appendChild(link); 
            a.title = arrayOfPagesJSON[i].date + " " + arrayOfPagesJSON[i].title; 
            a.href = "../" + arrayOfPagesJSON[i].category + "/" + arrayOfPagesJSON[i].fileName; 
            content.appendChild(a);
        }
    }
}

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
            console.log("we're doing something");
                // remove all child nodes from content DOM element
            content.textContent = '';
            makeCategoryContentLinks(arrOfCategories[i]);
        }
        categories.appendChild(a);
    }
}
