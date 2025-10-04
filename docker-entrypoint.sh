#!/bin/sh
set -e

# Print some debug information
echo "Starting V6Pictures React App..."
echo "Platform: $(uname -m)"
echo "Nginx version: $(nginx -v 2>&1)"

# Start nginx in foreground
exec nginx -g "daemon off;"
