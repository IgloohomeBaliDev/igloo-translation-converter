# DOCUMENTATION 

## Requirement
- Node.js
- NPM
 
## Run
### [find-not-translate]
Run this command if you will get the translation list that is not translated yet, and need to convert and give .csv or .json file to translator.

1. Add file **en.json** for the main file translation inside `input/find-not-translate` directory, main file name should be en.json and the content is using english
2. Add the translation file on `input/find-not-translate` directory, for example: ja.json
3. Run **'node index.js {type} {file_name}'** on terminal/cmd, example: **'node index.js find-not-translate ja.json'** 
    - *type*, find-not-translate
    - *file_name*, 
        -   [option 1] file comparison name (.json) for example: **ja.json**
        -   [option 2] if you have more than 1 file, give value 'all' and it will process all file 
            inside the `input/find-not-translate`
4. The result will be on `output/result-find-not-translate` directory, the output is translation file from .json (apps) that not translate yet, output result will be .csv & .json
5. Give the file to your translator.

### [csv-to-json]
Run this command for convert the translated data from translator's (.csv/.json) file back to your apps i18n.

1. Add translated .csv file & translation source .json inside `input/csv-to-json` directory
2. Run **'node index.js {type} {file_name} {source_file}'** on terminal/cmd, example: **'node index.js csv-to-json translated.csv ja.json'** or **'node index.js csv-to-json translated.json ja.json'**
    - *type*, csv-to-json
    - *file_name*, translated file name (.csv/.json)
    - *source_file*, translation source file (.json)
3. The result will be on `output/result-csv-to-json` directory, file that already translate by translator to .json (apps)
4. Add translation file to your apps.

### [nested-param-to-one]
Run this command for change nested key/parameter on translation file to the one line

1. Add translation file .json on `input/nested-param-to-one` directory, you can add all translation file into this directory
2. Run **'node index.js {type}'** on terminal/cmd, example: **'node index.js nested-param-to-one'**
    - *type*, nested-param-to-one
3. The result will be on `outpun/result-nested-param-to-one` directory, total file on the output directory will be same as the input
4. Copy all file on the output directory to your apps

## Example note
You can remove all **example file** inside input directory, but don't remove the `csv-to-json`, `find-not-translate`, & `nested-param-to-one` directory

## Report bug
Report bug to this [link](https://github.com/IgloohomeBaliDev/igloo-translation-converter/issues) then create new issue.
