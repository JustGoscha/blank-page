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
var multipleChoice;
var pIndex;
var sIndex;

function noNewline(i,j,section){
  var firstParagraph = j==0;
  var continuingParagraph = j>0;
  return !(firstParagraph && section.newline);
  //return !firstParagraph || !continuingParagraph;
}

/**
 * Tells the smallest fraction of the story and delegates interactions
 */
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
  
  if(part.multipleChoice){
    // create listeners for multiple choice
    var multipleChoice = paper.currentParagraph.getElementsByClassName("multiple-choice")[0];
    interaction.awaitChoice(multipleChoice).then(function(choice){
      multipleChoice.remove();
      tellSection(choice);
    });
    
  } else {
    var end = i>=section.paragraphs.length-1 && j>=section.paragraphs[i].length-1;
    if(!end){
      more = createMoreIndication(paper.currentParagraph);
      interaction.awaitInput(more).then(forEveryPart);
    }
  }

}

/** 
 * runs for every part (a part is a subsection of a paragraph)
 */
function forEveryPart(){
  sIndex++;
  if(sIndex < currentSection.paragraphs[pIndex].length){
    tellPart(currentSection,pIndex,sIndex);
    
  } else {
    pIndex++;
    forEveryParagraph();
  }
}

/**
 *  runs for every paragraph (of a section)
 */
function forEveryParagraph(){
  sIndex = 0;
  if(pIndex >= currentSection.paragraphs.length) return;

  tellPart(currentSection,pIndex,sIndex);
}

/**
 * Tells one complete section/path of a story
 */
function tellSection(id){
  currentSection = parser.section(_story[id]);
  if (currentSection.paragraphs.length>0){
    pIndex = 0;
    forEveryParagraph();
  } else {
    // end of story... ?
    // section has no paragraphs
    console.log(`Section ${currentPath} has no paragraphs. So this is the end`);
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