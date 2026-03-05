@echo off
echo Checking Thai JSON...
type "src\locales\th\translation.json" | find "maps"
echo.
echo Checking English JSON...  
type "src\locales\en\translation.json" | find "maps"
echo.
echo Done.
pause
