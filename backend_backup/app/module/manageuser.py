from flask import Flask, jsonify, request, url_for, jsonify, redirect
from app.config_flask import SECRET_KEY, check_whitelist
from app.config_db import get_db_connection
from flask_restful import Resource, reqparse
from app.config_mail import mail
from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from datetime import datetime, timedelta
import hashlib
import jwt

key = URLSafeTimedSerializer('lmd%055')

def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def validate_register(username, email, password, roles):
    return True

class Register(Resource):
    @check_whitelist
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', type=str, required=True)
        parser.add_argument('email', type=str, required=True)
        parser.add_argument('password', type=str, required=True)
        parser.add_argument('roles', type=int, required=True)
        args = parser.parse_args()
        
        username = args['username']
        email = args['email']
        password = args['password']
        roles = args['roles']
        
        token = request.headers.get('Authorization')
        if not token:
            return {'message': 'Token is missing', 'Status': 'error'}, 401
        
        payload = verify_token(token)
        if payload:
            email_executor = payload['email']
            password_executor = payload['password']
            if email_executor and password_executor:
                db, lmd = get_db_connection()
                lmd.execute("SELECT role from users where email = %s and password = %s", (email_executor, password_executor))
                fetch = lmd.fetchone()[0]
                if fetch == 2:
                    if validate_register(username, email, password, roles):
                        md5 = hashlib.md5(password.encode())
                        md5password = md5.hexdigest()

                        lmd.execute("SELECT count(*) from users where email = %s", (email,))
                        cek = lmd.fetchone()[0]
                        if cek == 0:
                            try:
                                lmd.execute("INSERT INTO users (username, email, password, role, verified) VALUES (%s, %s, %s, %s, %s)", (username, email, md5password, roles, 0))
                                lmd.close()
                                token = key.dumps(email)
                                msg = Message('Verifikasi Email', sender='your_email@example.com', recipients=[email])
                                verification_url = url_for('verifyemail', token=token, _external=True)
                                msg.body = f'Klik tautan ini untuk verifikasi email Anda: {verification_url}'
                                mail.send(msg)
                                db.commit()

                                return {"message": "Accounts Registration Success, Check your Email for Verification", 'Status': 'success'}
                            except Exception as e:
                                db.rollback()
                                return {'message': f'Error: {str(e)}'}
                        else:
                            return {"message": "Accounts already exists", "Status": "error"}
                    else:
                        return {"message": "Format Wrong", "Status": "warning"}
                else:
                    return {"message": "unauthorized", "Status": "error"}
        else:
            return {"message": "Token Invalid", "Status": "error"}
        
class ManageUser(Resource):
    @check_whitelist
    def get(self):
        db, lmd = get_db_connection()
        lmd.execute("SELECT * FROM users")
        data = lmd.fetchall()
        lmd.close()
        formatted_data = []
        
        for item in data:
            if item[4] == 2:
                role = 'Super Admin'
            elif item[4] == 1:
                role = 'Admin'
            else:
                role = 'User'
                
            formatted_data.append({
                'no': item[0],
                'username': item[1],
                'email': item[2],
                'role': role,
                'created_at': item[5].strftime("%Y-%m-%d %H:%M:%S")
            })
        
        return jsonify(formatted_data)
    
class DeleteUser(Resource):
    @check_whitelist
    def delete(self, no):
        db, lmd = get_db_connection()
        
        lmd.execute("SELECT email FROM users WHERE id = %s", (no,))
        existing_user = lmd.fetchone()
        
        lmd.execute('SELECT username from users where id = %s', (no,))
        username = lmd.fetchone()[0]
        
        if existing_user:
            lmd.execute("DELETE FROM users WHERE id = %s", (no,))
            db.commit()
            lmd.close()
            return {'message': f"User {username} has been deleted.", "Status": "success"}, 200
        else:
            lmd.close()
            return {'message': f"User {username} not found.", "Status": "error"}, 404
        
class EditUser(Resource):
    @check_whitelist
    def put(self, no):
        db, lmd = get_db_connection()

        token = request.headers.get('Authorization')
        if not token:
            return {'message': 'Token is missing', "Status": "error"}, 401
        
        payload = verify_token(token)
        if payload:
            email_executor = payload['email']
            password_executor = payload['password']
            if email_executor and password_executor:
                lmd.execute("SELECT role from users where email = %s and password = %s", (email_executor, password_executor))
                fetch = lmd.fetchone()[0]
                if fetch == 2:
                    lmd.execute("SELECT * FROM users WHERE id = %s", (no,))
                    existing_asset = lmd.fetchone()
                    
                    if existing_asset:
                        data = request.get_json()
                        password = data.get('password')
                        md5 = hashlib.md5(password.encode())
                        md5password = md5.hexdigest()
                        
                        if password is None:
                            lmd.execute(
                                """
                                UPDATE users
                                SET username = %s, role = %s, password = %s
                                WHERE id = %s
                                """,
                                (
                                    data.get("username"),
                                    data.get("userrole"),
                                    md5password,
                                    no,
                                ),
                            )
                            db.commit()
                            lmd.close()
                        else:
                            lmd.execute(
                                """
                                UPDATE users
                                SET username = %s, role = %s
                                WHERE id = %s
                                """,
                                (
                                    data.get("username"),
                                    data.get("userrole"),
                                    no,
                                ),
                            )
                            db.commit()
                            lmd.close()

                        return {'message': f"User {data.get('username')} has been updated.", "Status": "success"}, 200
                    else:
                        lmd.close()
                        return {"message": f"User {data.get('username')} not found.", "Status": "error"}, 404
                else:
                    return{"message": "you didnt have access to run this command", "Status": "error"}
                

class VerifyEmail(Resource):
    def get(self, token):
        try:
            db, lmd = get_db_connection()
            email = key.loads(token, max_age=3600).strip()  # Token berlaku selama 1 jam
            lmd.execute("SELECT * FROM users WHERE email = %s", (email,))
            user_data = lmd.fetchone()
            if user_data:
                user_id = user_data[0]
                lmd.execute("UPDATE users SET verified = %s WHERE id = %s", (1, user_id,))
                db.commit()
                return redirect('https://asset.lintasmediadanawa.com')
            else:
                return {'message': 'Email tidak ditemukan.', "Status": "error"}
        except SignatureExpired:
            new_token = key.dumps(email)
            msg = Message('Verifikasi Email', sender='your_email@example.com', recipients=[email])
            verification_url = url_for('VerifyEmail', token=new_token, _external=True)  # URL baru
            msg.body = f'Token lama telah kadaluwarsa. Klik tautan ini untuk verifikasi email Anda: {verification_url}'
            mail.send(msg)
            return {'message': 'Token expired, new verification link sent to your email', "Status": "warning"}


