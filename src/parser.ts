export type Story = {
  [key: string]: StorySection
}

export type StorySection = {
  paragraphs: string[][]
  newline: boolean

  // possible links of selections
  c: string[]
  // selection phrases
  s: string[]
  // raw section string
  r: string
}

export class Parser {
  paths(text: string): Story {
    const splitted = text.split(pathRegex)
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

  section(text: string) {
    var section = {} as StorySection
    var nl = trimNewlineOrSpace(text)

    text = nl[1]
    section.newline = nl[0]
    section.paragraphs = splitParagraphs(text)

    console.log(section)
    return section
  }

  part(part) {
    var html = parseFontStyle(part)
    html = parseLineBreaks(html)
    var mc = parseMultipleChoice(html)

    var parsed = {
      text: mc || html,
      multipleChoice: !!mc
    }

    return parsed
  }
}

// § - path delimiter
const pathRegex = /§(\w+)(?=\s)/
const beginsWithNewline = /^\s*\n/
const paraRegex = /^\s*\n/
const whiteSpace = /^\s*$/
const trailingWhitespace = /\s*$/
const more = "[...]"

const strong = /(\*\*|__)([^]*?)\1/g
const strongRepl = "<strong>$2</strong>"
const italics = /(\*|__)([^]*?)\1/g
const italicsRepl = "<em>$2</em>"

const multipleChoice = /(::)([^]*?)\1/ // ::(Choice one=>1)(Choice two=>2)::
const decisions = /(\()(.*?)=>(\w*)(\))/g

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

function splitParagraphs(text: string): string[][] {
  let paragraphs = text.split(/\r?\n\r?\n/g)
  paragraphs = paragraphs.filter(function(p) {
    return !whiteSpace.test(p)
  })
  const chunkedParagraphs = paragraphs.map(function(paragraph) {
    var ps = paragraph.split(more)
    ps[ps.length - 1] = ps[ps.length - 1].replace(trailingWhitespace, "")
    return ps
  })
  return chunkedParagraphs
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

function parseMultipleChoice(part: string) {
  const match = multipleChoice.exec(part)
  if (!match) return false
  const mc = match[2]

  const choiceHtml = '<div class="choice" data-path="$3">$2</div>'
  let choices = mc.replace(decisions, choiceHtml)
  if (mc == choices) return false
  choices = `<div class="multiple-choice">${choices}</div>`

  // replace in the input string
  part = part.replace(match[0], choices)
  return part
}

export const parser = new Parser()
export default parser
