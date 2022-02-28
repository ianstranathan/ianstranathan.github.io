let dummies = document.getElementsByClassName("latexWorkaround");
//let parent = dummies.item(i).parentNode;

// Really dumb workaround --> put inner html outside dummy element that was used in preprocessing
// css then sets dummy class' display to none
for(let i = 0; i < dummies.length; i++)
{
    //console.log(dummies.item(i).innerHTML);
    dummies.item(i).insertAdjacentHTML("afterend", dummies.item(i).innerHTML);
    //console.log(dummies.item(i).parentNode);
}
