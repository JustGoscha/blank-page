var content;

function Paper(element){
  if(element instanceof Element){
    this.element = element;
  } else if (element instanceof Array && element.length > 0){
    if(element[0] instanceof Element){
      this.element = element[0];
    } else {
      throw new Error("Provided an array with no element types.");
    }
  } else if (typeof element === "string"){
    this.element = document.querySelector(element);
    if(!this.element) throw new Error("Provided a string, but no element matches "+element);
  } else {
    throw new Error("Provide an element or id/class string of element to display your story on");
  } 

  initDocument(this.element);
}

function initDocument(el){
  // create top level wrapper
  var outer = document.createElement("div");
  var inner = document.createElement("div");
  outer.appendChild(inner);
  outer.classList.add("--gg-blank-page-wrapper");
  inner.classList.add("inner-wrapper");
  inner.innerText = "This is a test... a really really really really long long long test test test test test"
  el.appendChild(outer);
  content = inner;
}


var currentParagraph;

/**
 * Creates new paragraph on element
 * 
 * @param paragraph string
 */
Paper.prototype.writeParagraph = function(paragraph){
  var p = document.createElement("p");
  p.innerText = paragraph;
  currentParagraph = p;
  content.appendChild(p);
}

/**
 * Add text to paragraph after continue
 * 
 * @param more (description)
 */
Paper.prototype.continue = function(more){
  var p = currentParagraph;
  p.innerText = p.innerText + more;
}

export default Paper;

// function add(word){
//   var index = 0;
//   if(index < word.length){
//     var nextChar = function(){
//       var c = word[index];
//       if(/\s/g.test(c)){
//         index++
//         if (index >= word.length) return
        
//         c=c+word[index];
//       }
//       paper.continue(c)
//       index++;
//       if(index < word.length){
//         setTimeout(nextChar, 100);
//       }
//     }
//     setTimeout(nextChar, 10);
//   }
// }