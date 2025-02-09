#!/bin/bash

# =================================================================
# Docker Image Transfer Script
# =================================================================
# Description: This script saves a Docker image and transfers it to a 
# remote host using SCP. It handles the process of:
#   1. Saving the Docker image to a temporary file
#   2. Copying the file to a remote host
#   3. Cleaning up the temporary file
#
# Author: Antonio Sarro
# Date: 2024-12-02
# =================================================================

# Check if required arguments are provided
if [ $# -lt 2 ]; then
    echo "Usage: $0 <image_name> <remote_host>"
    echo "Example: $0 myimage:latest user@remote.host"
    exit 1
fi

IMAGE_NAME=$1
REMOTE_HOST=$2
TEMP_FILE="/tmp/docker_image.tar"

echo "Saving Docker image: $IMAGE_NAME"
docker save -o "$TEMP_FILE" "$IMAGE_NAME"

echo "Copying image to remote host: $REMOTE_HOST"
scp "$TEMP_FILE" "$REMOTE_HOST:$TEMP_FILE"

echo "Cleaning up temporary file"
rm "$TEMP_FILE"

echo "Done! To load the image on the remote host, run:"
echo "docker load -i $TEMP_FILE"