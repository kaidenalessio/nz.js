set nz_time_string=%time: =0%
ren build\nz.js nz-backup_%date:~10,4%%date:~4,2%%date:~7,2%_%nz_time_string:~0,2%%nz_time_string:~3,2%%nz_time_string:~6,2%.js
copy /b src\*.js+src\objects\*.js+Alias.js build\nz.js