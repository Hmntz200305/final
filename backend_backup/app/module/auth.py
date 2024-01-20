from flask import jsonify, request
from app.config_flask import SECRET_KEY, check_whitelist
from app.config_db import get_db_connection
from flask_restful import Resource, reqparse
import hashlib
import jwt

def generate_token(email, password):
    token = jwt.encode({'email': email, 'password': password}, SECRET_KEY, algorithm='HS256')
    return token


def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def validate_login(email, password):
    # Tambahkan logika validasi login sesuai kebutuhan Anda
    return True

class Login(Resource):
    @check_whitelist
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', type=str, required=True)
        parser.add_argument('password', type=str, required=True)
        args = parser.parse_args()

        email = args['email']
        password = args['password']

        if not email or not password:
            return {'message': 'The form must be filled in', "Status": "warning"}, 400
        
        # Lakukan validasi login
        if validate_login(email, password):
            md5 = hashlib.md5(password.encode())
            md5password = md5.hexdigest()

            db, lmd = get_db_connection()
            lmd.execute("SELECT count(*) from users where email = %s and password = %s and verified = %s", (email, md5password, 1))
            verif = lmd.fetchone()[0]
            
            lmd.execute("SELECT count(*) from users where email = %s and password = %s", (email, md5password,))
            cek = lmd.fetchone()[0]

            if cek > 0:
                if verif > 0:
                    lmd.execute("SELECT username, email, role from users where email = %s", (email,))
                    fetch = lmd.fetchone()
                    if fetch:
                        username, email, role = fetch[0], fetch[1], fetch[2]
                        token = generate_token(email, md5password)
                        return {'message': 'Login Berhasil', 'token': token, 'username': username, 'email': email, 'role': role, "Status": "success"}
                    else:
                        return {'message': 'Login failed: Email not found or incorrect password', "Status": "error"}, 401
                else:
                    return {'message': 'Please Verification your email first', "Status": "warning"}, 401
            else:
                return {'message': 'Login failed: Email not found or incorrect password', "Status": "error"}, 401
        else:
            return {'message': 'Login failed: Validation failed', "Status": "error"}, 401


class Authentication(Resource):
    @check_whitelist
    def post(self):
        db, lmd = get_db_connection()

        token = request.headers.get('Authorization')
        if not token:
            return {'message': 'Token is missing', "Status": "error"}, 401
        
        payload = verify_token(token)
        if payload:
            email = payload['email']
            password = payload['password']
            if email and password:
                lmd.execute("SELECT role from users where email = %s and password = %s", (email, password))
                role = lmd.fetchone()[0]
                lmd.execute('SELECT username from users where email = %s and password = %s', (email, password))
                username = lmd.fetchone()[0]
                if role == 2:
                    roles = 'Super Admin'
                elif role == 1:
                    roles = 'Admin'
                else:
                    roles = 'User'
                
                return{'role': role, 'username': username, 'roles': roles, "Status": "success"}
            else:
                 return{"message": "Email does not exist", "Status": "error"}   
        else:
            return{"message": "Invalid Token", "Status": "error"}
        
class AdminList(Resource):
    @check_whitelist
    def get(self):
        db, lmd = get_db_connection()
        lmd.execute('SELECT username,email from users where role IN (1,2)')
        fetch = lmd.fetchall()
        
        admin_list = []
        
        for row in fetch:
            username, email = row
            admin_list.append({
                'username': username,
                'email': email
            })
            
        return jsonify(admin_list)