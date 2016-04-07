require('chai').should()

parser = __require('parser')

text = """
§0
This is the first paragraph

Second Paragraph.

§1 Another path leads here. [...]
Well whatever.

"""

p1 = "\nThis is the first paragraph\n\nSecond Paragraph.\n\n"
p2 = " Another path leads here. [...]\nWell whatever.\n"

describe "Story Parser", ->
  it "should find all defined §paths in a story", ->
    parsed = parser.paths text
    console.log parsed
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

