#!/bin/bash

set -euxo pipefail

# Install dependencies
apt-get update -q
apt-get install -y git

# Install nvm and use it to install Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install node

# Create systemd service for pm2
cat > /etc/systemd/system/notehub.service << EOF
[Unit]
Description=Notehub Server

[Service]
User=root
WorkingDirectory=/var/www/notehub.app/server/build
ExecStart=$(which node) server.js --name notehub-server
KillMode=process
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable notehub.service
systemctl start notehub.service
