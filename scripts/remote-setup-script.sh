#!/bin/bash

set -euxo pipefail

# Install dependencies
apt-get update -q
apt-get install -y git nginx

# Configure nginx
cat > /etc/nginx/sites-available/notehub.app << EOF
server {
  listen 80;
  server_name notehub.app;

  root /var/www/notehub.app;
  index index.html;

  location / {
    try_files \$uri \$uri/ /index.html;
  }
}
EOF

ln -s /etc/nginx/sites-available/notehub.app /etc/nginx/sites-enabled/notehub.app
rm /etc/nginx/sites-enabled/default

# Restart nginx
systemctl restart nginx

echo "Deployment complete!"

