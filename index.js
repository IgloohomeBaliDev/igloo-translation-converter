// Read the readme.md for Documentation
const fs = require('fs');
const path = require('path');

// fs Sync Recursive
// src: https://gist.github.com/aditAtSinTask/6f7832b48e9ebe1d37ab9ac1791b6291
class FsSyncRecursive {
  dirName = __dirname;

  r(pathDir, opts, deep) {
    opts = {
      returnFilePath: false,
      hierarchy: true,
      fileInfo: false,
      ...opts
    };

    deep = !deep ? 0 : deep;

    let result = [];
    const readdirResult = fs.readdirSync(pathDir);

    readdirResult.map((data) => {
      const currentFilePath = path.resolve(pathDir, data);
      const fileStat = fs.statSync(currentFilePath);
      
      if (fileStat && fileStat.isDirectory()) {
        const recursiveRecursive = this.r(currentFilePath, opts, (deep + 1));
        if (opts.hierarchy) {
          result = [
            ...result,
            recursiveRecursive
          ];
        } else {
          result = [
            ...result,
            ...recursiveRecursive
          ];
        }
      } else {
        if (opts.fileInfo) {
          result = [
            ...result,
            {
              fullPath: pathDir,
              path: pathDir.replace(this.dirName, ''),
              pathNoRoot: pathDir.substr(0, 1) === '\/',
              filename: data,
              deep: deep
            }
          ];
        } else {
          result = [
            ...result,
            opts.returnFilePath ? currentFilePath : data
          ];
        }
      }
    });

    return result;
  }

  d(pathDir, deep) {
    let splitPathFile = pathDir.split('\/');

    deep = !deep ? 0 : deep;

    if (!fs.existsSync(pathDir)) {
      try {
        fs.mkdirSync(pathDir);
      } catch (e) {
        splitPathFile.pop();
        splitPathFile = splitPathFile.join('\/');
        this.d(splitPathFile, (deep - 1));
        this.d(pathDir, deep);
      }
    }
  }

  w(pathFile, filename, content) {
    this.d(pathFile);
    fs.writeFileSync(`${pathFile}/${filename}`, content);

    return;
  }
}

// find-not-translate
function convertToCSV(objArray) {
  const array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  let str = 'Param,Value\r\n';

  for (let key in array) {
    let line = '';
    if (array.hasOwnProperty(key)) {
      const pkey = key;
      let value = array[key];
      value = value.split('\n').join('\\n');

      line += `"${pkey}","${value}"`;
      str += line + '\r\n';
    }
  }

  return str;
}

function filterJsonNotTranslated(rlParse, rrParse) {
  let result = {};

  for (let key in rlParse) {
    if (rlParse.hasOwnProperty(key)) {
      const mainLKey = key;
      const mainLValue = rlParse[key];
      const mainRValue = rrParse[key];

      if (mainLValue === mainRValue) {
        result[mainLKey] = `${mainLValue}`;
      }
    }
  }

  return result;
}

// csv-to-json
function convertBackToJSON(result, mapNewLine, type) {
  if (type === '.csv') {
    mapNewLine.map((data, index) => {
      if (index > 0) {
        if (!!data) {
          const splitData = data.split(',');
          const key = splitData[0].substr(1).substr(0, (splitData[0].length - 2));
          const value = splitData[1].substr(1).substr(0, (splitData[1].length - 2));
          
          result[key] = value;
        }
      }
    });
  } else if (type === '.json') {
    for (let key in mapNewLine) {
      if (mapNewLine.hasOwnProperty(key)) {
        const rkey = key;
        const rvalue = mapNewLine[key];

        result[rkey] = rvalue;
      }
    }
  }

  return result;
}

// nested-param-to-one
function nestedObjectToDot(object, currentKey) {
  let result = {};

  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      const rkey = key;
      const rvalue = object[key];
      let finalKey = rkey;

      if (!!currentKey) {
        finalKey = `${currentKey}.${rkey}`;
      }

      if (typeof(rvalue) === 'string') {
        result[finalKey] = rvalue;
      } else if (typeof(rvalue) === 'object') {
        result = {
          ...result,
          ...nestedObjectToDot(rvalue, finalKey)
        };
      }
    }
  }

  return result;
}

(async () => {
  let paramInput = [];
  process.argv.forEach(function (val, index) {
    paramInput[index] = val;
  });
  
  try {
    if (!fs.existsSync(`output`)) {
      fs.mkdirSync(`output`);
    }

    if (paramInput[2] === 'find-not-translate') {
      if (!paramInput[3]) {
        throw 'Param3NotFound';
      }
 
      // Find not translate yet
      const readLeftFileSync = fs.readFileSync(`input/${paramInput[2]}/en.json`, 'utf8');
      const readRightileSync = fs.readFileSync(`input/${paramInput[2]}/${paramInput[3]}`, 'utf8');

      const rlParse = JSON.parse(readLeftFileSync);
      const rrParse = JSON.parse(readRightileSync);
      const result = filterJsonNotTranslated(rlParse, rrParse);

      if (!fs.existsSync(`output/result-${paramInput[2]}`)) {
        fs.mkdirSync(`output/result-${paramInput[2]}`);

        if (!!fs.existsSync(`output/result-${paramInput[2]}/result.json`)) {
          fs.unlinkSync(`output/result-${paramInput[2]}/result.json`);
        }
        if (!!fs.existsSync(`output/result-${paramInput[2]}/result.csv`)) {
          fs.unlinkSync(`output/result-${paramInput[2]}/result.csv`);
        }
      }

      fs.writeFileSync(`output/result-${paramInput[2]}/result.json`, JSON.stringify(result, null, 2));
      fs.writeFileSync(`output/result-${paramInput[2]}/result.csv`, convertToCSV(result));

      console.log(`Finished! please check output/result-${paramInput[2]} directory`);
    } else if (paramInput[2] === 'csv-to-json') {
      if (!paramInput[3]) {
        throw 'Param3NotFound';
      } else if (!paramInput[4]) {
        throw 'Param4NotFound';
      }

      // Get extension
      const gotExtensionCSV = paramInput[3].slice(-4);
      const gotExtensionJSON = paramInput[3].slice(-5);

      // CSV translated to JSON (Apps)
      const readFileSync = fs.readFileSync(`input/${paramInput[2]}/${paramInput[3]}`, 'utf8');
      const readSourceFileSync = fs.readFileSync(`input/${paramInput[2]}/${paramInput[4]}`, 'utf8');
      
      let mapNewLine;
      let currentExtension;

      if (gotExtensionCSV === '.csv') {
        mapNewLine = readFileSync.split('\r\n');
        currentExtension = gotExtensionCSV;
      } else if (gotExtensionJSON === '.json') {
        mapNewLine = JSON.parse(readFileSync);
        currentExtension = gotExtensionJSON;
      } else {
        throw 'ParamExtensionNotAllowed';
      }

      const sourceParse = JSON.parse(readSourceFileSync);
      const result = convertBackToJSON(sourceParse, mapNewLine, currentExtension);

      if (!fs.existsSync(`output/result-${paramInput[2]}`)) {
        fs.mkdirSync(`output/result-${paramInput[2]}`);

        if (!!fs.existsSync(`output/result-${paramInput[2]}/result.json`)) {
          fs.unlinkSync(`output/result-${paramInput[2]}/result.json`);
        }
      }

      fs.writeFileSync(`output/result-${paramInput[2]}/result.json`, JSON.stringify(result, null, 2));
      
      console.log(`Finished! please check output/result-${paramInput[2]} directory`);
    } else if (paramInput[2] === 'nested-param-to-one') {
      const fsr = new FsSyncRecursive();
      const fileSyncRecursiveResult = fsr.r(`input/${paramInput[2]}`, {
        returnFilePath: true,
        hierarchy: false,
        fileInfo: true
      });

      if (!fs.existsSync(`output/result-${paramInput[2]}`)) {
        fs.mkdirSync(`output/result-${paramInput[2]}`);
      } else {
        const fileOutputSyncRecursiveResult = fsr.r(`output/result-${paramInput[2]}`, {
          returnFilePath: true,
          hierarchy: false,
          fileInfo: true
        });
       
        fileOutputSyncRecursiveResult.map((data) => {
          const rpath = data.fullPath;
          const filename = data.filename;

          fs.unlinkSync(`${rpath}/${filename}`);
        });
      }

      fileSyncRecursiveResult.map((data) => {
        const rpath = data.fullPath;
        const filename = data.filename;

        if (filename.slice(-5) === '.json') {
          const readFileSync = fs.readFileSync(`${rpath}/${filename}`, 'utf8');
          const newResult = nestedObjectToDot(JSON.parse(readFileSync), '');

          fs.writeFileSync(`output/result-${paramInput[2]}/${filename}`, JSON.stringify(newResult, null, 2));
        }
      });

      console.log(`Finished! please check output/result-${paramInput[2]} directory`);
    } else if (paramInput[2] === 'clean-all-input') {
      const fsr = new FsSyncRecursive();
      const fileSyncRecursiveResult = fsr.r(`input`, {
        returnFilePath: true,
        hierarchy: false,
        fileInfo: true
      });

      fileSyncRecursiveResult.map((data) => {
        const rpath = data.fullPath;
        const filename = data.filename;

        fs.unlinkSync(`${rpath}/${filename}`);
      });

      console.log(`Finished! all input are deleted`);
    } else {
      throw 'Param2NotFound';
    }
  } catch (e) {
    console.log('Error');
    console.log('-----');
    if (!!e.toString().startsWith('Error: ENOENT: no such file or directory, open \'file')) {
      if (!!paramInput[3]) {
        console.log(`> Check the parameter value ${paramInput[3]} (file name), this file is not found on 'file' directory`);
      } else {
        console.log(`> Insert the parameter 3 - file_name param`);
      }
    } else if (e === 'Param2NotFound') {
      console.log(`> Parameter 2 not found`);
    } else if (e === 'Param3NotFound') {
      console.log(`> Parameter 3 not found`);
    } else if (e === 'Param4NotFound') {
      console.log(`> Parameter 4 not found`);
    } else if (e === 'ParamExtensionNotAllowed') {
      console.log(`> Parameter 3 file_name/translated file should be .csv or .json`);
    } else {
      console.log(`> Undefined error`);
      console.log(`-- Error details --`);
      console.log(e);
    }
    console.log('-----');
  }
})();