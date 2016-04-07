var ajax = require("./ajax.js");
var parser = require("./parser.js");

var done = false;
var doneCallback = function(){
  console.log("standard done callback");
};
var story;

var Blank = function(url, element){
  ajax(url,function(data){
    // parse story...
    story = parser.paths(data);
    doneCallback
    done = true;
  });
  return this;
}

Blank.prototype.start = function(){
  var start = function(){};
  if(done){
    // start story
    start();
  } else {
    doneCallback = function(){
      console.log("new done callback");
      start();
    }
  }
}

window.Blank = Blank;