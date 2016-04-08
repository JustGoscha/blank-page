import "../lib/mousetrap.min.js"

var interaction = {};

interaction.awaitInput = function(element){
  var promise = new Promise(function(resolve,reject){
    var resolver = function(){
      resolve(true);
    };
    element.addEventListener("click", resolver);
    "a b c d e f g h i j k l m n o p q r s t u v w x y z space enter return".split(" ").map(function(key){
      Mousetrap.bind(key, resolver);
    });
  });
  return promise;
}

export default interaction;
