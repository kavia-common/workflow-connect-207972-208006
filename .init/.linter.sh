#!/bin/bash
cd /home/kavia/workspace/code-generation/workflow-connect-207972-208006/workflow_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

