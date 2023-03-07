#!/bin/bash

set -euxo pipefail

# Install dependencies
apt-get update -q
apt-get install -y git nginx

# Configure nginx
cat > /etc/nginx/sites-available/notehub.app << EOF
server {
  listen 80;
  listen [::]:80;
  server_name _;

  root /var/www/notehub.app/client/build;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /socket.io {
    proxy_pass http://localhost:4000;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
EOF

ln -s /etc/nginx/sites-available/notehub.app /etc/nginx/sites-enabled/notehub.app
rm /etc/nginx/sites-enabled/default

# Restart nginx
systemctl restart nginx

echo "Deployment complete!"

