"use strict"
function Parser() {}

// § - path delimiter
var pathRegex = /§(\w+)(?=\s)/
var beginsWithNewline = /^\s*\n/
var paraRegex = /^\s*\n/
var whiteSpace = /^\s*$/
var trailingWhitespace = /\s*$/
var more = "[...]"

var strong = /(\*\*|__)([^]*?)\1/g
var strongRepl = "<strong>$2</strong>"
var italics = /(\*|__)([^]*?)\1/g
var italicsRepl = "<em>$2</em>"

var multipleChoice = /(::)([^]*?)\1/ // ::(Choice one=>1)(Choice two=>2)::
var decisions = /(\()(.*?)=>(\w*)(\))/g

Parser.prototype.paths = function(text) {
  var splitted = text.split(pathRegex)
  var paths = {}
  for (var i = 1; i < splitted.length; i += 2) {
    if (paths[splitted[i]] === undefined) {
      paths[splitted[i]] = splitted[i + 1]
    } else {
      console.log(
        `Warning - Path ${paths[splitted[i]]} defined multiple times!`
      )
    }
  }
  console.log(paths)
  return paths
}

function trimSpace(text) {
  if (text.indexOf(" ") === 0) {
    // remove first space from non newline sections
    text = text.slice(1, text.length - 1)
  }
  return text
}

function trimNewlineOrSpace(text) {
  var newline = beginsWithNewline.test(text)
  if (newline) text = text.split(beginsWithNewline)[1]
  else text = trimSpace(text)
  return [newline, text]
}

function splitParagraphs(text) {
  var paragraphs = text.split(/\r?\n\r?\n/g)
  paragraphs = paragraphs.filter(function(p) {
    return !whiteSpace.test(p)
  })
  paragraphs = paragraphs.map(function(p) {
    var ps = p.split(more)
    ps[ps.length - 1] = ps[ps.length - 1].replace(trailingWhitespace, "")
    return ps
  })
  return paragraphs
}

Parser.prototype.section = function(text) {
  var section = {} as any
  var nl = trimNewlineOrSpace(text)

  text = nl[1]
  section.newline = nl[0]
  section.paragraphs = splitParagraphs(text)

  console.log(section)
  return section
}

function parseFontStyle(text) {
  // *italics*
  // **strong**

  text = text.replace(strong, strongRepl)
  text = text.replace(italics, italicsRepl)
  return text
}

function parseLineBreaks(text) {
  return text.replace(/\r?\n/g, "<br>")
}

function parseMultipleChoice(part) {
  var match = multipleChoice.exec(part)
  if (!match) return false
  var mc = match[2]

  var choiceHtml = '<div class="choice" data-path="$3">$2</div>'
  var choices = mc.replace(decisions, choiceHtml)
  if (mc == choices) return false
  choices = `<div class="multiple-choice">${choices}</div>`

  // replace in the input string
  part = part.replace(match[0], choices)
  return part
}

Parser.prototype.part = function(part) {
  var html = parseFontStyle(part)
  html = parseLineBreaks(html)
  var mc = parseMultipleChoice(html)

  var parsed = {
    text: mc || html,
    multipleChoice: !!mc
  }

  return parsed
}

var parser = new Parser()
// module.exports = parser;
export default parser
