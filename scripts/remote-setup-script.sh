#!/bin/bash
set -eux

# Install dependencies
# apt-get update -q
apt-get install -y git nginx

# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

# Activate nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install the latest version of Node.js
nvm install node

# Clone repository
cd /var/www
# git clone https://github.com/zwhitchcox/notehub.app

# Install Node.js dependencies
cd notehub.app
npm install

# Build the application
npm run build

# Install pm2
npm install pm2 -g

# Start the application using pm2
pm2 start npm --name "notehub.app" -- start
pm2 save
pm2 startup systemd

# Configure nginx
cat > /etc/nginx/sites-available/notehub.app << EOF
server {
  listen 80;
  server_name notehub.app;

  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
EOF

ln -s /etc/nginx/sites-available/notehub.app /etc/nginx/sites-enabled/notehub.app

# Restart nginx
systemctl restart nginx
