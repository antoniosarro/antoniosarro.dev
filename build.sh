#!/bin/bash

###############################################################################
# Docker Build Script
# ------------------
# Description:
#   This script builds a Docker image and optionally pushes it to a specified
#   registry. It automatically handles version tagging based on package.json 
#   and supports both 'latest' and versioned tags.
#
# Usage:
#   ./build.sh [options]
#
# Options:
#   -p, --push              Push images to registry after building
#   -r, --registry URL      Specify registry URL (default: 10.10.70.6:5000)
#   -i, --image NAME        Specify image name (default: antoniosarro_v2.dev)
#   -h, --help              Show help message
###############################################################################

set -e  # Exit on error

# Default values
REGISTRY="10.10.70.6:5000"
IMAGE_NAME="antoniosarro.dev"
PUSH=false

# Function to display help message
show_help() {
    echo "Usage: $0 [-p|--push] [-r|--registry URL] [-i|--image NAME]"
    echo "Options:"
    echo "  -p, --push              Push images to registry after building"
    echo "  -r, --registry URL      Specify registry URL (default: $REGISTRY)"
    echo "  -i, --image NAME        Specify image name (default: $IMAGE_NAME)"
    echo "  -h, --help              Show this help message"
    exit 0
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--push)     PUSH=true ;;
        -r|--registry) REGISTRY="$2"; shift ;;
        -i|--image)    IMAGE_NAME="$2"; shift ;;
        -h|--help)     show_help ;;
        *)             echo "Unknown option: $1"; exit 1 ;;
    esac
    shift
done

# Get script directory and check required files
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
PACKAGE_JSON="$SCRIPT_DIR/package.json"

# Validate required files
[[ ! -f "$PACKAGE_JSON" ]] && { echo "Error: package.json not found"; exit 1; }

# Clean up existing images
if [[ "$(docker images -q "$IMAGE_NAME:latest" 2>/dev/null)" != "" ]]; then
    echo "Removing existing image..."
    docker rmi -f "$(docker images -q "$IMAGE_NAME:latest")"
fi

# Get version
VERSION=$(jq -r '.version' "$PACKAGE_JSON")

build_image() {
    local version="$1"

    echo "Building Docker image: $IMAGE_NAME:$version"
    docker build -t "$IMAGE_NAME:$version" .
    docker tag "$IMAGE_NAME:$version" "$IMAGE_NAME:latest"
}

push_image() {
    local version="$1"
    
    echo "Pushing images to registry: $REGISTRY"
    docker tag "$IMAGE_NAME:latest" "$REGISTRY/$IMAGE_NAME:latest"
    docker tag "$IMAGE_NAME:$version" "$REGISTRY/$IMAGE_NAME:$version"
    
    docker push "$REGISTRY/$IMAGE_NAME:$version"
    docker push "$REGISTRY/$IMAGE_NAME:latest"
}

# Build and optionally push the image
build_image "$VERSION"
[[ "$PUSH" = true ]] && push_image "$VERSION"
echo "Build completed successfully!"