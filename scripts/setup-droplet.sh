#!/bin/bash

set -euxo pipefail

get_droplet_ip_by_name() {
  local name="$1"
  doctl compute droplet list --format Name,PublicIPv4 --no-header | awk -v droplet_name="$name" '$1 == droplet_name {print $2; exit}'
}

droplet_ip=$(get_droplet_ip_by_name $DROPLET_NAME)

# Copy setup script to Droplet
scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ./scripts/remote-setup-nginx.sh root@$droplet_ip:/root/setup-nginx.sh

# Run setup script on Droplet
ssh -o StrictHostKeyChecking=no root@$droplet_ip 'bash /root/setup-nginx.sh'

# Copy setup script to Droplet
scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ./scripts/remote-setup-socket-server.sh root@$droplet_ip:/root/setup-socket-server.sh

# Run setup script on Droplet
ssh -o StrictHostKeyChecking=no root@$droplet_ip 'bash /root/setup-socket-server.sh'
