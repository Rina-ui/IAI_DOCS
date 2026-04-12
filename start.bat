@echo off
echo Starting IAI_DOCS project...

echo [Backend] Starting development server...
start "Backend" cmd /k "cd Backend && bun run start:debug"

echo [Mobile] Starting Expo...
start "Mobile" cmd /k "cd web && bun run dev"

echo Both services are starting in separate windows.
