import { parser } from "./parser"

const text = `
§0
This is the first paragraph

Second Paragraph.

§1 Another path leads here. [...]
Well whatever.
`

const text2 = `
§0
Ich erwachte durch einen lauten Knall. [...] Finsternis umgab mich. Selbst durch die Kunststoffjalousien konnte ich kaum einen Lichtschein erkennen.
::(Im zimmer Umschauen=>1) (Zum Fenster gehen=>2) (Zur Tür gehen=>4)::


§1
Ich kniff die Augen zusammen und suchte mein Zimmer ab. Meine digitale Uhr leuchtete nicht. Der Strom schien ausgefallen zu sein, denn keines der elektrischen Geräte schien ein Licht abzugeben. Trotzdessen war es beängstigend dunkel im Raum.

§2 Bla blub
§3 Lol (4 - What?)

§4 This is the end (end)

$end

`
const multiple =
  "Blabla bla, Mr Freeman ::(Im zimmer Umschauen=>1)(Zum Fenster gehen=>2)(Zur Tür gehen=>4)::"

// Object.values(parser.paths(text2)).forEach(parser.section)

const p1 = "\nThis is the first paragraph\n\nSecond Paragraph.\n\n"
const p2 = " Another path leads here. [...]\nWell whatever.\n"

describe("Story Parser", () => {
  it("should find all defined §paths in a story", () => {
    const parsed = parser.paths(text)
    expect(parsed["0"]).toEqual(
      "\nThis is the first paragraph\n\nSecond Paragraph.\n\n"
    )
    expect(parsed["1"]).toEqual(
      " Another path leads here. [...]\nWell whatever.\n"
    )
  })

  it("should parse a section", () => {
    const pp1 = parser.section(p1)
    const pp2 = parser.section(p2)

    expect(pp1.newline).toBe(true)
    expect(pp1.paragraphs.length).toEqual(2)
    expect(pp1.paragraphs[0].length).toEqual(1)
    expect(pp1.paragraphs[0][0]).toEqual("This is the first paragraph")

    expect(pp2.newline).toBe(false)
    expect(pp2.paragraphs.length).toEqual(1)
    expect(pp2.paragraphs[0].length).toEqual(2)
    expect(pp2.paragraphs[0][0]).toEqual("Another path leads here. ")
    expect(pp2.paragraphs[0][1]).toEqual("\nWell whatever.")
  })

  it("should parse a part of a section for display", () => {
    const parsed = parser.part(multiple)
    console.log(parsed)
    expect(parsed.multipleChoice).toBe(true)
    expect(parsed.text).toEqual(
      `Blabla bla, Mr Freeman <div class="multiple-choice"><div class="choice" data-path="1">Im zimmer Umschauen</div><div class="choice" data-path="2">Zum Fenster gehen</div><div class="choice" data-path="4">Zur Tür gehen</div></div>`
    )
  })
})
