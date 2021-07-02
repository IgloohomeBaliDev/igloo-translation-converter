## DOCUMENTATION 

### Requirement
---
- Node.js
- NPM
 
### Run
---
#### [find-not-translate]
Run this command if you will get the translation list that is not translated yet, and need to convert and give .csv or .json file to translator.

1. Add file **en.json** for the main file translation inside `input/find-not-translate` directory, main file name should be en.json and the content is using english
2. Add the translation file on `input/find-not-translate` directory, for example: ja.json
3. Run **'node index.js {type} {file_name}'** on terminal/cmd, example: **'node index.js find-not-translate ja.json'** 
    - *type*, find-not-translate
    - *file_name*, file comparison name (.json)
4. The result will be on `output/result-{type}` directory, the output is translation file from .json (apps) that not translate yet, output result will be .csv & .json
5. Give the file to your translator.

#### [csv-to-json]
Run this command for convert the translated data from translator's (.csv/.json) file back to your apps i18n.

1. Add translated .csv file & translation source .json inside `input/csv-to-json` directory
2. Run **'node index.js {type} {file_name} {source_file}'** on terminal/cmd, example: **'node index.js csv-to-json translated.csv ja.json'** or **'node index.js csv-to-json translated.json ja.json'**
    - *type*, csv-to-json
    - *file_name*, translated file name (.csv/.json)
    - *source_file*, translation source file (.json)
3. The result will be on `output/result-{type}` directory, file that already translate by translator to .json (apps)
4. Add translation file to your apps.

### Report bug
---
Report bug to this [link](https://github.com/IgloohomeBaliDev/igloo-translation-converter/issues)
