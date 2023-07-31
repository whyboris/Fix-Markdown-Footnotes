#!/usr/bin/env node

const fs = require("fs");

let crypto;
try {
  crypto = require("node:crypto");
} catch (err) {
  crypto = require("crypto");
}

const { fdir } = require("fdir");

const FILE_TO_FIX = process.argv[2];

if (!FILE_TO_FIX) {

  console.log('Please provide a single file name or `*` after command')

} else if (FILE_TO_FIX.toLowerCase().endsWith('.md')) {

  fixFile(FILE_TO_FIX)

} else if (FILE_TO_FIX == '*') {

  const api = new fdir().withFullPaths().crawl(".")
  const files = api.sync()
  const avoidNodeModules = files.filter((file) => !file.includes("/node_modules/"))
  const filtered = avoidNodeModules.filter((file) => file.toLocaleLowerCase().endsWith('.md'))

  filtered.forEach((file) => {
    fixFile(file)
  })
  console.log("Fixed these files:")
  console.log(filtered)

} else {
  console.log(FILE_TO_FIX)
  console.log('Error: expected a .md filename or `*`')
}

const re = /(\[\^[^\]]*])/g;
// This regex generates a list (group) of matches of `[^`
// followed by any number of characters that are NOT `]`
// and then captures `]` ending the match group
// A resulting array example: ['[^1]', '[^2]', '[^3]']

function fixFile(fileToFix) {

  fs.readFile(fileToFix, "utf8", (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.log("ERROR:", fileToFix, "not found");
      } else {
        console.log(err);
      }
      return;
    }

    const groups = data.match(re);
    // console.log(groups);

    if (!!(groups.length % 2)) {
      console.log("ERROR: there is not a matching number of footnote links and footnotes! Script ABORTED!");
    } else {

      const renameMap1 = new Map();
      const renameMap2 = new Map();

      let counter = 1;

      groups.forEach((el) => {
        if (counter <= groups.length / 2) {
          const tempRandom = getRandom()
          renameMap1.set(el, tempRandom);
          renameMap2.set(tempRandom, "[^" + counter + "]")
          counter++;
        }
      });

      // console.log(renameMap1);
      // console.log(renameMap2);

      renameMap1.forEach((value, key, map) => {
        data = data.replaceAll(key, value);
      });

      renameMap2.forEach((value, key, map) => {
        data = data.replaceAll(key, value);
      });

      // console.log(data)
      writeFile(fileToFix, data);
    }
  })
}

function getRandom() {
  return crypto.randomBytes(10).toString('hex');
}

function writeFile(path, fileString) {
  fs.writeFile(path, fileString, (err) => {
    if (err) {
      console.log("ERROR !!?!?!");
      console.log(err);
    }
  });
}

