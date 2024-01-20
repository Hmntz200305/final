from app.config_db import get_db_connection
from flask_restful import Resource, reqparse
from app.config_flask import SECRET_KEY, check_whitelist
from app.config_mail import mail  
from flask_mail import Message
from flask import url_for
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
import hashlib


def validate_reset(username, email, password):
    return True

key = URLSafeTimedSerializer('lmd%055')

class ForgotPassword(Resource):
    @check_whitelist
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('FUsername', type=str, required=True)
        parser.add_argument('FEmail', type=str, required=True)
        parser.add_argument('FPassword', type=str, required=True)
        args = parser.parse_args()

        username = args['FUsername']
        email = args['FEmail']
        password = args['FPassword']
        
        if validate_reset(username, email, password):
            md5 = hashlib.md5(password.encode())
            md5password = md5.hexdigest()
            user_info = {
                'username': username,
                'email': email,
                'password': md5password,
            }
            token = key.dumps(user_info)
            msg = Message('Verifikasi Email', sender='your_email@example.com', recipients=[email])
            verification_url = url_for('verifyemailforgotpw', token=token, _external=True)
            msg.body = f'Klik tautan ini untuk verifikasi Reset Password Anda: {verification_url}'
            mail.send(msg)
                                
            return {'message': 'Recovery Mail telah dikirim ke email', "Status": "success"}
            
            
class VerifyEmailForgotPw(Resource):
    def get(self, token):
        try:
            db, lmd = get_db_connection()
            user_info = key.loads(token, max_age=3600)
            username = user_info['username']
            email = user_info['email']
            password = user_info['password']
            lmd.execute('UPDATE users set password = %s where username = %s and email = %s', (password, username, email))
            db.commit()
            return redirect('https://asset.lintasmediadanawa.com')
        except SignatureExpired:
            user_info = {
                'username': username,
                'email': email,
                'password': password,
            }
            new_token = key.dumps(user_info)
            msg = Message('Verifikasi Email', sender='your_email@example.com', recipients=[email])
            verification_url = url_for('VerifyEmail', token=new_token, _external=True)  # URL baru
            msg.body = f'Token lama telah kadaluwarsa. Klik tautan ini untuk verifikasi Reset Password Anda: {verification_url}'
            mail.send(msg)
            db.rollback()
            return {'message': 'Token expired, new verification link sent to your email'}
