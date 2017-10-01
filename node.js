"use strict";

const { readFile, writeFile } = require("fs");
const { promisify } = require("util");

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

//just for test
const FILE_1 = "./file1.txt";
const FILE_2 = "./file2.txt";
const RESULT_PATH = "./result.txt";
//

async function createDiffFile(firstPath, secondPath, resultPath) {
  try {
    // Load&prepare files
    const filesToCompare = await Promise.all(
      [firstPath, secondPath].map(path =>
        readFileAsync(path, { encoding: "utf8" })
      )
    );
    var parsedFiles = filesToCompare.map(file => file.split("\r\n"));

    // Write file
    await writeFileAsync(resultPath, processFiles(parsedFiles), {
      encoding: "utf8"
    });
  } catch (err) {
    console.log(err);
  }
}

function processFiles([file1, file2]) {
  let lng = file1.length < file2.length ? file2.length : file1.length;
  let res = [];
  let counter = 0;
  for (let i = 0; i < lng; i++) {
    if (
      file1[i] !== file2[i] &&
      !file1.includes(file2[i]) &&
      !file2.includes(file1[i]) &&
      file1[i] &&
      file2[i]
    ) {
      res.push(`${++counter} * ${file1[i]}|${file2[i]}`);
    } else if (!file1.includes(file2[i]) || !file2.includes(file1[i])) {
      if (!file1.includes(file2[i]) && file2[i])
        res.push(`${++counter} + ${file2[i]}`);
      if (!file2.includes(file1[i]) && file1[i])
        res.push(`${++counter} - ${file1[i]}`);
    } else {
      if (file2.includes(file1[i])) res.push(`${++counter}   ${file1[i]}`);
      if (file2.includes(file2[i])) res.push(`${++counter}   ${file2[i]}`);
    }
  }
  console.log(lng);
  return res.join("\r\n");
}

// just for test
createDiffFile(FILE_1, FILE_2, RESULT_PATH);
//
