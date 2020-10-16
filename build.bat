@echo off
rem Todo:
rem Name with time stamp YYYYMMDD_HHMMSS
rem Remove the first line in every file before merge
copy /b src\*.js+src\objects\*.js+Alias.js nz-build_%date:~10,4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%%time:~6,2%.js
PAUSE