#!/bin/bash

# This script will exit if the branch is not main on Vercel production deploys

if [[ "$VERCEL_GIT_COMMIT_REF" != "add/sei-network"  ]] ; then
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0;

else
  # Proceed with the build
    echo "✅ - Build can proceed"
  exit 1;
fi
