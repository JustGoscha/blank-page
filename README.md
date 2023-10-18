# Blank Page - Simple Interactive Story Language


<p align="center">
  <a href="https://travis-ci.com/JustGoscha/blank-page">
    <img alt="Travis CI Build Status" src="https://travis-ci.com/JustGoscha/blank-page.svg?branch=master">
  </a>
  
  <a href="https://dl.circleci.com/status-badge/redirect/circleci/HHeEJgsZJ3nARZgYFF9Mbh/CYwpVjSSZKKW77qEXnNKEB/tree/main">
    <img alt="Circle CI Build Status" src="https://dl.circleci.com/status-badge/img/circleci/HHeEJgsZJ3nARZgYFF9Mbh/CYwpVjSSZKKW77qEXnNKEB/tree/master.svg?style=svg">
  </a>
  
  <a href="https://codecov.io/gh/JustGoscha/blank-page" > 
    <img src="https://codecov.io/gh/JustGoscha/blank-page/graph/badge.svg?token=B7t1uYM8Tu"/> 
  </a>
  <a href="https://twitter.com/acdlite/status/974390255393505280">
    <img alt="Blazing Fast" src="https://img.shields.io/badge/speed-blazing%20%F0%9F%94%A5-brightgreen.svg?style=flat-square">
  </a>
  <a href="#badge">
    <img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square">
  </a>
</p>

An simple interactive story engine.

DEMO<br>
www.justgoscha.com/blank-page

# Blank Page - Documentation

## Overview

Blank Page is a custom markup language for writing interactive stories. This language allows you to create branching narratives where the reader can make choices that affect the direction of the story. This documentation will provide a comprehensive overview of the language's features and how to use them.

## Table of Contents

- [Features](#features)
- [Syntax](#syntax)
- [Example Story](#example-story)
- [Parser](#parser)
- [Testing the Parser](#testing-the-parser)

## Features

1. **Branching Narrative**: Create interactive stories where readers can make choices that lead to different story paths.

2. **Paragraphs**: Organize your story into paragraphs, making it easy to read and follow.

3. **Choices**: Define choices that readers can make to progress the story in different directions.

4. **Multiple Choice**: Present multiple choices to the reader, allowing them to select from a list of options.

5. **Ending**: Define an ending for your story, marking the conclusion of the narrative.

## Syntax

The Blank Page Language uses a simple syntax to define the structure of your interactive story. Here are the key elements:

- `§X`: Defines a story section with the ID `X`. Sections contain paragraphs of text and choices.

- `::(Choice Text=>X)::`: Defines a choice that leads to section `§X`. The choice text is displayed to the reader.

- `::(Choice Text=>Y)(Another Choice=>Z)::`: Define multiple choices within a section.

- `[...]`: This notation is used to create a dramatic pause in the narrative. When the reader encounters `[...]`, they are prompted to click or press a button to reveal more text, adding suspense and engagement to the storytelling experience.

- `$end`: Marks the end of the story.

## Example Story

Here's an example of a story written in the Interactive Story Language:

```example.story
§0
I was woken by a loud bang. [...] Darkness surrounded me. Even through the louvered blinds came no light. ::(Lookaround the room=>1)(Go to the window=>2)(Go to the door=>3)(Go back to sleep=>sleep)::

§1
I squinted trying to see more in the room. The light of my digital clock was out. So was every other electrical light in my room. There must be a power failure I guessed. ::(Go to the window=>2)(Find some light=>light)::

§2 
I forced myself to stand up. I still felt the drowsiness in my body. The adrenaline rush from the bang was wearing off. I lurched slowly to the window trying not to trip over something on the floor. I reached my hands out, until my hands felt the slats of the blinds.

I spread the blades between my fingers to take a look, but to my surprise I only saw more darkness. No street lights. Nothing, not even the stars and the moon seemed to shine. The power outage must've hit the whole district. ::(Find some light=>4)(Go to the door=>3)::

§3 
I sneaked to the door feeling the cold parquet on my naked feet. Stepping out in the corridor I saw only more emptiness. Good that as I child I often used to pretend I'm blind and could move around like DareDevil across our apartment. ...

§4 
What could I use as a light source? My mobile I thought and rushed back to bed with slightly more confidence. 
::(Pick up phone=>light)(Go back to sleep=>sleep)::

§light
I picked up my phone from the bed and pushed the button. [...] Dead! [...] Dammit, why didn't I plug it in before going to bed. What else could I use? I have no flashlight nothing. Damn those new technologies and apps. [...] I could go to the kitchen and find a lighter or some matches. ::(Go to kitchen=>kitchen)(Go back to sleep=>sleep)::

§sleep
"What the heck, let's sleep it out, in the morning I'll see more", I thought and laid myself back to bed.

§kitchen
I decided to check out the kitchen. As I was walking...

§end
```
