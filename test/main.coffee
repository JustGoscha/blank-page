process.env.NODE_ENV = "test"

global.__require = (file)=>
  require("#{__dirname}/js/#{file}");

describe "Blank Page Unit Tests:", ->
  require './parser.coffee'
