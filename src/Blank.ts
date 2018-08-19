import ajax from "./ajax"
import parser from "./parser"
import storyteller from "./storyteller"

var done = false
var doneCallback = function() {
  console.log("standard done callback")
}
var story
var el

export class Blank {
  constructor(private url, element) {
    this.url = url
    el = element
    ajax(
      url,
      data => {
        // parse story...
        story = parser.paths(data)
        doneCallback()
        done = true
      },
      undefined,
      undefined
    )
    return this
  }

  start() {
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
}
;(window as any).Blank = Blank
