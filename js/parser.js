var parser = {};

// § - path delimiter
var pathRegex = /§(\w+)(?=\s)/;
var beginsWithNewline = /^\s*\n/;
var paraRegex = /^\s*\n/;
var whiteSpace = /^\s*$/;
var trailingWhitespace = /\s*$/;
var more = "[...]";


parser.paths = function(text){
  var splitted = text.split(pathRegex);
  var paths = {};
  for(var i = 1; i<splitted.length; i+=2){
    if(paths[splitted[i]] == undefined){
      paths[splitted[i]] = splitted[i+1];
    } else {
      console.log(`Warning - Path ${paths[splitted[i]]} defined multiple times!`);
    }
  }
  console.log(paths)
  return paths;
}

function trimSpace(text){
  if(text.indexOf(" ")==0){
    // remove first space from non newline sections
    text = text.slice(1, text.length-1);
  }
  return text;
}

function trimNewlineOrSpace(text){
  var newline = beginsWithNewline.test(text);
  if(newline) text = text.split(beginsWithNewline)[1];
  else text = trimSpace(text);
  return [newline, text];
}

function splitParagraphs(text){
  var paragraphs = text.split("\n\n");
  paragraphs = paragraphs.filter(function(p){
    return !whiteSpace.test(p);
  });
  paragraphs = paragraphs.map(function(p){
    var ps = p.split(more);
    ps[ps.length-1] = ps[ps.length-1].replace(trailingWhitespace, "");
    return ps;
  })
  return paragraphs;
}

parser.section = function(text){
  var section = {};
  var nl = trimNewlineOrSpace(text);

  text = nl[1];
  section.newline = nl[0];
  section.paragraphs = splitParagraphs(text);

  console.log(section);
  return section;
}



module.exports = parser;