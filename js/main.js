import ajax from "./ajax.js"
import parser from "./parser.js"
import storyteller from "./storyteller.js"

var done = false
var doneCallback = function() {
  console.log("standard done callback")
}
var story
var el

var Blank = function(url, element) {
  this.url = url
  el = element
  ajax(url, data => {
    // parse story...
    story = parser.paths(data)
    doneCallback()
    done = true
  })
  return this
}

Blank.prototype.start = function() {
  var start = () => {
    storyteller.start(el, story)
  }
  if (done) {
    // start story
    start()
  } else {
    doneCallback = function() {
      console.log("new done callback")
      start()
    }
  }
}

window.Blank = Blank
