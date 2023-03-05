#!/bin/bash
set -eux

get_fingerprint() {
  local name="$(hostname)"
  local fingerprint

  fingerprint=$(doctl compute ssh-key list -o json | jq -r --arg name "$name" '.[] | select(.name == $name) | .fingerprint')

  if [[ -z "$fingerprint" ]]; then
    echo "Error: Key with name '$name' not found." >&2
    return 1
  fi

  echo "$fingerprint"
}

# Create Droplet
droplet_id=$(doctl compute droplet create $DROPLET_NAME --size $DROPLET_SIZE --image $DROPLET_IMAGE --region $DROPLET_REGION --format ID --no-header --wait --ssh-keys $(get_fingerprint))

# Get Droplet IP address
droplet_ip=$(doctl compute droplet get $droplet_id --format PublicIPv4 --no-header)

# Wait for Droplet to be ready
echo "Waiting for Droplet to be ready..."
while ! nc -z $droplet_ip 22; do
  sleep 1
done
