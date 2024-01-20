from app import app
from flask_sslify import SSLify
import os

if __name__ == '__main__':
    cert_path = '/home/my-app/ssl/lmd.crt'
    key_path = '/home/my-app/ssl/lmd.key'
    app.run(ssl_context=(cert_path, key_path), host='0.0.0.0', port=8443, debug=True)
