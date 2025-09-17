@echo off
call docker build --platform linux/amd64 -t tripolskypetr/findface-bridge . -f Dockerfile
call docker push tripolskypetr/findface-bridge:latest
