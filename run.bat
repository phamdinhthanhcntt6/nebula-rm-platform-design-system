@echo off
REM Chay nhanh prototype So khach: double-click file nay, hoac: run.bat [cong]
setlocal
set PORT=5190
if not "%~1"=="" set PORT=%~1
set URL=http://127.0.0.1:%PORT%/prototype-nebula/

cd /d "%~dp0project"

REM Server da chay san o cong nay -> chi mo trinh duyet
netstat -ano | findstr /r /c:":%PORT% .*LISTENING" >nul
if %errorlevel%==0 (
  echo Server da chay san o cong %PORT%. Mo %URL%
  start "" "%URL%"
  exit /b 0
)

REM Tim Python: uu tien "python", neu khong co thi dung "py"
set PY=
where python >nul 2>nul && set PY=python
if not defined PY where py >nul 2>nul && set PY=py
if not defined PY (
  echo Khong tim thay Python. Cai Python tai https://www.python.org/downloads/ roi chay lai.
  pause
  exit /b 1
)

echo Dang chay server tai %URL%
echo Nhan Ctrl+C de dung.
REM Mo trinh duyet sau 1 giay de server kip khoi dong
start "" /b cmd /c "timeout /t 1 /nobreak >nul & start "" "%URL%""
%PY% -m http.server %PORT%
