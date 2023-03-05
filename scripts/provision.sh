#!/bin/bash

set -euxo pipefail

# Set Droplet variables
export DROPLET_NAME=notehub.app
export DROPLET_SIZE=s-1vcpu-1gb
export DROPLET_IMAGE=ubuntu-20-04-x64
export DROPLET_REGION=nyc1
export DROPLET_USERNAME=root

# bash scripts/create-droplet.sh
bash scripts/setup-droplet.sh
# bash scripts/generate-key-pair.sh

echo "Deployment complete!"
