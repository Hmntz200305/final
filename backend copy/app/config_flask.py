from flask import request, abort
import os

SECRET_KEY = os.environ.get('SECRET_KEY', 'lmd%055@2022')
server_ip = os.environ.get('server_ip', 'https://asset.lintasmediadanawa.com:8443')
UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', './app/static/upload/')
QRCode_FOLDER = os.environ.get('QRCode_FOLDER', './app/static/QRCode/')
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif'}

whitelisted_ips = ["https://asset.lintasmediadanawa.com/", "https://asset.lintasmediadanawa.com:2096/"]

def check_whitelist(func):
    def wrapper(*args, **kwargs):
        client_ip = request.referrer
        if client_ip not in whitelisted_ips:
            return abort(403)
        return func(*args, **kwargs)
    return wrapper