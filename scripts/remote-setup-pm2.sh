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

# Install pm2
npm install -g pm2

mkdir -p /var/www/notehub.app

# Create systemd service for pm2
cat > /etc/systemd/system/notehub.service << EOF
[Unit]
Description=Notehub Server

[Service]
User=root
WorkingDirectory=/var/www/notehub.app/server
ExecStart=/usr/bin/pm2 start index.js --name notehub-server
ExecReload=/usr/bin/pm2 reload all
ExecStop=/usr/bin/pm2 stop all
KillMode=process
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable notehub.service
systemctl start notehub.service
