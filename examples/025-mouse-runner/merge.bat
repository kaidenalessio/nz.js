cls
@echo off
echo ### MERGE START ###### %time: =0%
echo Merging scenes...
copy /b src\lvl\*.js+src\scn\*.js src\scenes.js > nul
echo Merging classes...
copy /b "src\cls\main\*.js"+"src\cls\*.js" src\classes.js > nul
echo ### MERGE COMPLETE ### %time: =0%