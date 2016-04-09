require('chai').should()

parser = __require('parser')
# `import parser from "../js/parser.js

text = """
§0
This is the first paragraph

Second Paragraph.

§1 Another path leads here. [...]
Well whatever.

"""

text2 = """
§0
Ich erwachte durch einen lauten Knall. [...] Finsternis umgab mich. Selbst durch die Kunststoffjalousien konnte ich kaum einen Lichtschein erkennen.
::(Im zimmer Umschauen=>1) (Zum Fenster gehen=>2) (Zur Tür gehen=>4)::


§1
Ich kniff die Augen zusammen und suchte mein Zimmer ab. Meine digitale Uhr leuchtete nicht. Der Strom schien ausgefallen zu sein, denn keines der elektrischen Geräte schien ein Licht abzugeben. Trotzdessen war es beängstigend dunkel im Raum.

§2 Bla blub
§3 Lol (4 - What?)

§4 This is the end (end)

$end

"""

multiple = "Blabla bla, Mr Freeman ::(Im zimmer Umschauen=>1)(Zum Fenster gehen=>2)(Zur Tür gehen=>4)::"

for k,val of parser.paths text2 then parser.section val

p1 = "\nThis is the first paragraph\n\nSecond Paragraph.\n\n"
p2 = " Another path leads here. [...]\nWell whatever.\n"

describe "Story Parser", ->
  it "should find all defined §paths in a story", ->
    parsed = parser.paths text
    parsed["0"].should.equal "\nThis is the first paragraph\n\nSecond Paragraph.\n\n"
    parsed["1"].should.equal " Another path leads here. [...]\nWell whatever.\n"

  it "should parse a section", ->
    pp1 = parser.section p1
    pp2 = parser.section p2

    pp1.newline.should.be.true
    pp1.paragraphs.length.should.equal 2
    pp1.paragraphs[0].length.should.equal 1
    pp1.paragraphs[0][0].should.equal "This is the first paragraph"

    pp2.newline.should.be.false
    pp2.paragraphs.length.should.equal 1
    pp2.paragraphs[0].length.should.equal 2
    pp2.paragraphs[0][0].should.equal "Another path leads here. "
    pp2.paragraphs[0][1].should.equal "\nWell whatever."

  it "should parse a part of a section for display", ->
    parsed = parser.part multiple
    console.log parsed
    parsed.multipleChoice.should.be.true
    parsed.text.should.equal """Blabla bla, Mr Freeman <div class="multiple-choice"><div class="choice" data-path="1">Im zimmer Umschauen</div><div class="choice" data-path="2">Zum Fenster gehen</div><div class="choice" data-path="4">Zur Tür gehen</div></div>"""



