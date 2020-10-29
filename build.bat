@echo off
set nz_time_start=%time: =0%
echo ### NZ BUILD START ###### %nz_time_start%
echo Renaming...
ren build\nz.js nz-backup_%date:~10,4%%date:~4,2%%date:~7,2%_%nz_time_start:~0,2%%nz_time_start:~3,2%%nz_time_start:~6,2%%nz_time_start:~9,2%.js
echo Copying...
copy /b src\*.js+src\objects\*.js+Alias.js build\nz.js >nul
echo ### NZ BUILD COMPLETE ### %time: =0%