#!/bin/bash
# run the js through babel so the module systems are commonjs for mocha
mkdir ./test/js
#find ./js/*.js -type f -exec sh -c './node_modules/babel-cli/bin/babel.js "$0" > test/"$0"' {} ';'
# ./node_modules/mocha/bin/mocha ./test/main.coffee --compilers js:babel-core/register --compilers coffee:./coffee-babel --reporter spec
./node_modules/mocha/bin/mocha ./test/main.coffee --compilers coffee:./coffee-babel --reporter spec

# now delete all compiled files again
rm -r ./test/js