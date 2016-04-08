import parser from "./parser.js";
import Paper from "./paper.js";

function Storyteller(){}

var currentPath = "0"; // start  
var currentSection = null;

Storyteller.prototype.start = function(element, story){
  // init
  this.paper = new Paper(element);
  debugger
  
  // parse starting point §0
  parser.section(story[0]);
}

function tellSection(id){
  currentSection = parser.section(id);
  if (currentSection.paragraphs.length>0){
    // if(currentSection){}
  } else {
    // end of story... 
  }
  
}

var storyteller = new Storyteller();
export default storyteller;