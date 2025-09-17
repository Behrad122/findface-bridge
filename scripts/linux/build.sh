#!/bin/bash
bun install --ignore-scripts || npm install --ignore-scripts
npm run build
