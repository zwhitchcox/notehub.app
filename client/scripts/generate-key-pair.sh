#!/bin/bash

set -euxo pipefail

get_droplet_ip_by_name() {
  local name="$1"
  doctl compute droplet list --format Name,PublicIPv4 --no-header | awk -v droplet_name="$name" '$1 == droplet_name {print $2; exit}'
}

DROPLET_IP=$(get_droplet_ip_by_name $DROPLET_NAME)

# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "github-actions@$DROPLET_NAME" -f github-actions-key -P ""
#
# Add private key to GitHub Actions secrets
gh secret set PRIVATE_KEY -b "$(cat github-actions-key)"

# Add other secrets to GitHub Actions secrets
gh secret set DROPLET_USERNAME -b "$DROPLET_USERNAME"
gh secret set DROPLET_IP -b "$DROPLET_IP"

ssh-copy-id -i github-actions-key.pub root@$DROPLET_IP

# Remove SSH keys
rm -f github-actions-key github-actions-key.pub

echo "SSH key pair created and added to GitHub Actions secrets and DigitalOcean droplet!"

