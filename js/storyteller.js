import parser from "./parser.js";
import Paper from "./paper.js";
import interaction from "./interaction.js";

function Storyteller(){}

var currentPath = "0"; // start  
var currentSection = null;
var paper;
var _story;

Storyteller.prototype.start = function(element, story){
  // init
  paper = new Paper(element);
  _story = story;
  
  // parse starting point §0
  tellSection(currentPath);
}

var more;

function noNewline(i,j,section){
  var firstParagraph = i==0 && j==0 && section.newline;
  var continuingParagraph = j>0;
  return firstParagraph || continuingParagraph;
}

function tellPart(section, i, j){
  if(more) more.remove()
  // only first line of section first part
  // write new paragraph or continue old one...
  var part = parser.part(section.paragraphs[i][j]);
  if(noNewline(i, j, section)){
    paper.continue(part.text);
  } else {
    paper.writeParagraph(part.text);
  }
  
  var end = i>=section.paragraphs.length-1 && j>=section.paragraphs.length-1;

  if(!end){
    more = createMoreIndication(paper.currentParagraph);
  }

}

function tellSection(id){
  currentSection = parser.section(_story[id]);

  if (currentSection.paragraphs.length>0){
    var pIndex = 0;
    var forEveryParagraph = function(){
      var sIndex = 0;
      if(pIndex >= currentSection.paragraphs.length) return;
      // debugger
      tellPart(currentSection,pIndex,sIndex);

      var forEveryPart = function(){
        // debugger
        sIndex++;
        if(sIndex < currentSection.paragraphs[pIndex].length){
          tellPart(currentSection,pIndex,sIndex);

          interaction.awaitInput(more).then(forEveryPart);
        } else {
          pIndex++;
          forEveryParagraph();
        }
      }
      interaction.awaitInput(more).then(forEveryPart);
    }

    forEveryParagraph();

  

    // write to paper
    // 
    // add more... to interaction
    // 
    // 
    // put callback into paper
    // what if button is pushed?
    // also call callback...
    // finish animation quickly... then write next one.
    // if(currentSection){}
  } else {
    // end of story... ?
  }
  
}

function createMoreIndication(p){
  var span = document.createElement("span");
  span.innerText = "››";
  span.classList.add("more");
  p.appendChild(span);
  return span;
}

var storyteller = new Storyteller();
export default storyteller;