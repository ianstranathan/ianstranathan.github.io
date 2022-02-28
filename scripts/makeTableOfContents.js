// Ordered List of all h1 and h2 elements on DOM
var h1s = document.getElementsByTagName("h1");
var h2s = document.getElementsByTagName("h2");

if(h1s.length != 0)
{
	makeTableOfContents(h1s, h2s);
}

function makeTableOfContents(h1Elements, h2Elements)
{
	let tocLiteral =`
	<div id="toc_container">
	<p class="toc_title">Contents</p>
	<ul class="toc_list" id="toc_list">
	</ul>
	</div>
	`

	// Append the table of content div to the document body
	let contentDiv = document.getElementById("content");
	contentDiv.insertAdjacentHTML("afterbegin", tocLiteral);

	var toc_ul = document.getElementById("toc_list");
	toc_ul.style.listStyle = "disc";
	// The list of h1 & h2 elements are ordered
	// --> compare if the h2[i] is after the current h1[i]&& before the next h1[i]

	for(let i = 0; i < h1Elements.length; ++i)
	{
	
		// make the first subheader <ul> for main topic
		let bulletPoint = h1Elements.item(i).innerText;
		let li = document.createElement("li");
		let a = document.createElement('a');
		let link = document.createTextNode(bulletPoint);
		a.appendChild(link);  
		a.title = bulletPoint 
		a.href = "#" +  h1Elements.item(i).id;
		li.appendChild(a);
		
		for(let j = 0; j < h2Elements.length; ++j)
		{
		
		// on need to check if it's after the i'th
		if( i == h1Elements.length - 1)
		{
			if(h2Elements.item(j).compareDocumentPosition(h1Elements.item(i)) & Node.DOCUMENT_POSITION_PRECEDING)
			{
			let subBulletContainer = document.createElement("ul");
			subBulletContainer.style.listStyle = "circle";
			let subbulletPoint =  h2Elements.item(j).innerText;
			let another_li = document.createElement("li");
			let another_a = document.createElement('a');
			let anotherLink = document.createTextNode(subbulletPoint);
			another_a.appendChild(anotherLink);  
			another_a.title = subbulletPoint; 
			another_a.href = "#" +  h2Elements.item(j).id;
			another_li.appendChild(another_a);
			subBulletContainer.appendChild(another_li)
			// append the to the list item in previous scoope (Original Bullet point / topic)
			li.appendChild(subBulletContainer);
			}
		}
		// check if the h2 is both after the i'th and before the i'th + 1
		else if( (h2Elements.item(j).compareDocumentPosition(h1Elements.item(i)) & Node.DOCUMENT_POSITION_PRECEDING)
			&&
			(h2Elements.item(j).compareDocumentPosition(h1Elements.item(i + 1)) & Node.DOCUMENT_POSITION_FOLLOWING)
		)
		{
			let subBulletContainer = document.createElement("ul");
			let subbulletPoint =  h2Elements.item(j).innerText;
			let another_li = document.createElement("li");
			let another_a = document.createElement('a');
			let anotherLink = document.createTextNode(subbulletPoint);
			another_a.appendChild(anotherLink);  
			another_a.title = subbulletPoint; 
			another_a.href = "#" +  h2Elements.item(j).id;
			another_li.appendChild(another_a);
			subBulletContainer.appendChild(another_li)
			// append the to the list item in previous scoope (Original Bullet point / topic)
			li.appendChild(subBulletContainer);
		}

		// append the current bullent point
		toc_ul.appendChild(li);
		}
	}	
}

// let tocLiteral =`
// <div id="toc_container">
//   <p class="toc_title">Contents</p>
//   <ul class="toc_list" id="toc_list">
//   </ul>
// </div>
// `

// // Append the table of content div to the document body
// let contentDiv = document.getElementById("content");
// contentDiv.insertAdjacentHTML("afterbegin", tocLiteral);

// var toc_ul = document.getElementById("toc_list");
// toc_ul.style.listStyle = "disc";
// // The list of h1 & h2 elements are ordered
// // --> compare if the h2[i] is after the current h1[i]&& before the next h1[i]

// for(let i = 0; i < h1Elements.length; ++i)
// {
  
//     // make the first subheader <ul> for main topic
//     let bulletPoint = h1Elements.item(i).innerText;
//     let li = document.createElement("li");
//     let a = document.createElement('a');
//     let link = document.createTextNode(bulletPoint);
//     a.appendChild(link);  
//     a.title = bulletPoint 
//     a.href = "#" +  h1Elements.item(i).id;
//     li.appendChild(a);
    
//     for(let j = 0; j < h2Elements.length; ++j)
//     {
	
// 	// on need to check if it's after the i'th
// 	if( i == h1Elements.length - 1)
// 	{
// 	    if(h2Elements.item(j).compareDocumentPosition(h1Elements.item(i)) & Node.DOCUMENT_POSITION_PRECEDING)
// 	    {
// 		let subBulletContainer = document.createElement("ul");
// 		subBulletContainer.style.listStyle = "circle";
// 		let subbulletPoint =  h2Elements.item(j).innerText;
// 		let another_li = document.createElement("li");
// 		let another_a = document.createElement('a');
// 		let anotherLink = document.createTextNode(subbulletPoint);
// 		another_a.appendChild(anotherLink);  
// 		another_a.title = subbulletPoint; 
// 		another_a.href = "#" +  h2Elements.item(j).id;
// 		another_li.appendChild(another_a);
// 		subBulletContainer.appendChild(another_li)
// 		// append the to the list item in previous scoope (Original Bullet point / topic)
// 		li.appendChild(subBulletContainer);
// 	    }
// 	}
// 	// check if the h2 is both after the i'th and before the i'th + 1
// 	else if( (h2Elements.item(j).compareDocumentPosition(h1Elements.item(i)) & Node.DOCUMENT_POSITION_PRECEDING)
// 		 &&
// 		 (h2Elements.item(j).compareDocumentPosition(h1Elements.item(i + 1)) & Node.DOCUMENT_POSITION_FOLLOWING)
// 	  )
// 	{
// 	    let subBulletContainer = document.createElement("ul");
// 	    let subbulletPoint =  h2Elements.item(j).innerText;
// 	    let another_li = document.createElement("li");
// 	    let another_a = document.createElement('a');
// 	    let anotherLink = document.createTextNode(subbulletPoint);
// 	    another_a.appendChild(anotherLink);  
// 	    another_a.title = subbulletPoint; 
// 	    another_a.href = "#" +  h2Elements.item(j).id;
// 	    another_li.appendChild(another_a);
// 	    subBulletContainer.appendChild(another_li)
// 	    // append the to the list item in previous scoope (Original Bullet point / topic)
// 	    li.appendChild(subBulletContainer);
// 	}

// 	// append the current bullent point
// 	toc_ul.appendChild(li);
//     }
// }

