@echo off
call bun install --ignore-scripts
if errorlevel 1 call npm install --ignore-scripts
call npm run build
