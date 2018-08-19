import Mousetrap from "mousetrap"

export default {
  awaitInput(element) {
    var promise = new Promise(function(resolve, reject) {
      var resolver = function() {
        resolve(true)
      }
      element.addEventListener("click", resolver)
      "a b c d e f g h i j k l m n o p q r s t u v w x y z space enter return"
        .split(" ")
        .map(function(key) {
          Mousetrap.bind(key, resolver)
        })
    })
    return promise
  },
  awaitChoice(element) {
    var promise = new Promise(function(resolve, reject) {
      var choices = element.getElementsByClassName("choice")
      Array.from(choices).forEach(function(choice: any) {
        choice.addEventListener("click", function() {
          var path = choice.getAttribute("data-path")
          resolve(path)
        })
      })
    })
    return promise
  }
}
