#!/bin/bash
docker build --platform linux/amd64 -t tripolskypetr/findface-bridge . -f Dockerfile
docker push tripolskypetr/findface-bridge:latest
