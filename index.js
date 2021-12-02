const fs = require('fs');
const {normalize, dirname, sep} = require('path');

// sep is \ on Windows / on POSIX
const baseFile = 'data' + sep + 'A.txt';

const readFileData = file =>
  fs.readFileSync(file, 'utf8')
  .trim()
  .split('\n')
  .filter(e => e);

const logTraverseDir = [];

/**
 *
 * @param file (path from data directory. ex: data/one/c.txt)
 * @param filesArray (array of traversed files path. Used to check circular reference.)
 * @param sumInFiles (Object with file path as key and it's TOTAL SUM as value)
 * @returns {{sum: number, sumInFiles}}
 */
const sumOfDigits = (file, filesArray, sumInFiles) => {
  let sum = 0;
  const lines = readFileData(file);

  logTraverseDir.push(filesArray);

  for (const line of lines) {
    const num = parseFloat(line);
    if (num) {
      sum += num;
    } else {
      const fp = normalize(dirname(file) + sep + line);
      if (fs.existsSync(fp) && !filesArray.includes(fp)) {

        const {sum: sumRecursive, sumInFiles: sumInFilesRecursive} =
          sumOfDigits(fp, [...filesArray, fp], sumInFiles);

        sumInFiles = { ...sumInFilesRecursive };
        sumInFiles[fp] = sumRecursive;
        sum += sumRecursive;
      } else {
        console.warn(`Warning: "${fp}" is either invalid or already parsed.`)
      }
    }
  }

  sumInFiles[baseFile] = sum;

  return {
    sum,
    sumInFiles
  };
}

const data = sumOfDigits(baseFile, [baseFile], []);

console.log("Sum of all numbers:", data);
console.log("Path traversed: ", logTraverseDir);

