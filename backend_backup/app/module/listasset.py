from app.config_db import get_db_connection
from flask_restful import Resource
from werkzeug.utils import secure_filename
from flask import jsonify, request, current_app
from app.config_flask import SECRET_KEY, check_whitelist
import shutil
import json
import jwt
import os


class ListAsset(Resource):
    @check_whitelist
    def get(self):
        db, lmd = get_db_connection()
        lmd.execute("SELECT * FROM assets")
        data = lmd.fetchall()
        lmd.close()
        formatted_data = [{
            'no': item[0],
            'id': item[1],
            'name': item[2],
            'description': item[3],
            'brand': item[4],
            'model': item[5],
            'status': item[6],
            'location': item[7],
            'category': item[8],
            'sn': item[9],
            'image_path': item[10],
            'qrcode_path': item[11],
            'created_at': item[12].strftime("%Y-%m-%d %H:%M:%S"),
        } for item in data]
        json_data = json.dumps(formatted_data)
        return jsonify(formatted_data)
    
    
def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
    
def validate_editasset(ids, name, description, brand, model, status, location, category, sn):
    if not ids or not name or not description or not brand or not model or not status or not location or not category or not sn:
        return False
    return True
    
class EditAsset(Resource):
    @check_whitelist
    def put(self, idasset):
        db, lmd = get_db_connection()

        token = request.headers.get('Authorization')
        if not token:
            return {'message': 'Token is missing', 'Status': 'error'}, 401
        
        payload = verify_token(token)
        if payload:
            email_executor = payload['email']
            password_executor = payload['password']
            if email_executor and password_executor:
                lmd.execute("SELECT role from users where email = %s and password = %s", (email_executor, password_executor))
                fetch = lmd.fetchone()[0]
                if fetch == 2:
                    lmd.execute("SELECT * FROM assets WHERE id = %s", (idasset,))
                    existing_asset = lmd.fetchone()

                    if existing_asset:
                        data = request.form 
                        ids = data.get("id")
                        name = data.get("name")
                        description = data.get("description")
                        brand = data.get("brand")
                        model = data.get("model")
                        status = data.get("status")
                        location = data.get("location")
                        category = data.get("category")
                        sn = data.get("sn")
                        file = request.files.get('addAssetImage')
                        
                        if not validate_editasset(ids, name, description, brand, model, status, location, category, sn):
                            return {"message": "Data is incomplete", 'Status': 'warning'}, 400
                        
                        if file:
                            original_filename = secure_filename(file.filename)
                            file_extension = os.path.splitext(original_filename)[1]
                            filename = secure_filename(ids) + file_extension
                            save_path = os.path.join(current_app.config['UPLOAD_FOLDER'], ids)
                            os.makedirs(save_path, exist_ok=True)
                            file.save(os.path.join(save_path, filename))
                            image_path = ('https://asset.lintasmediadanawa.com:8443/static/upload/' + ids + '/' + filename)
                            lmd.execute("UPDATE assets set asset = %s, name = %s, description = %s, brand = %s, model = %s, status = %s, location = %s, category = %s, serialnumber = %s, photo = %s where id = %s", (ids, name, description, brand, model, status, location, category, sn, image_path, idasset))
                            db.commit()
                            lmd.close()
                        else:
                            lmd.execute("UPDATE assets set asset = %s, name = %s, description = %s, brand = %s, model = %s, status = %s, location = %s, category = %s, serialnumber = %s where id = %s", (ids, name, description, brand, model, status, location, category, sn, idasset))
                            db.commit()
                            lmd.close()
                        return {'message': f"Asset with ID {ids} has been updated.", "Status": 'success'}, 200
                    else:
                        # Aset tidak ditemukan, berikan pesan kesalahan
                        lmd.close()
                        return {"message": f"Asset with ID {ids} not found.", "Status": "error"}, 404
                else:
                    return{"message": "you didnt have access to run this command", "Status": "error"}

class DeleteAsset(Resource):
    @check_whitelist
    def delete(self, asset_id):
        # Membuat koneksi ke database
        db, lmd = get_db_connection()
        
        # Cek apakah aset dengan ID yang diberikan ada dalam database
        lmd.execute("SELECT asset FROM assets WHERE id = %s", (asset_id,))
        existing_asset = lmd.fetchone()[0]
        
        if existing_asset:
            # Aset ditemukan, maka kita dapat menghapusnya
            lmd.execute("DELETE FROM assets WHERE id = %s", (asset_id,))
            dirphoto = os.path.join(current_app.config['UPLOAD_FOLDER'], existing_asset)
            try:
                shutil.rmtree(dirphoto)
            except OSError as e:
                print(f"Error: {e}")
            db.commit()
            lmd.close()
            return {'message': "Asset with ID {} has been deleted.".format(existing_asset), "Status": "success"}, 200
        else:
            # Aset tidak ditemukan, berikan pesan kesalahan
            lmd.close()
            return {'message': "Asset with ID {} not found.".format(existing_asset), "Status": "error"}, 404
        
class StatusList(Resource):
    @check_whitelist
    def get(self):
        db, lmd = get_db_connection()
        lmd.execute("SELECT * FROM status")
        status_data = lmd.fetchall()
        lmd.close()
        formatted_status_data = [{
            'id': item[0],
            'status': item[1]
        } for item in status_data]

        return jsonify(formatted_status_data)
    
class LocationList(Resource):
    @check_whitelist
    def get(self):
        db, lmd = get_db_connection()
        lmd.execute("SELECT * FROM location")
        location_data = lmd.fetchall()
        lmd.close()
        formatted_location_data = [{
            'id': item[0],
            'location': item[1]
        } for item in location_data]

        return jsonify(formatted_location_data)

class CategoryList(Resource):
    @check_whitelist
    def get(self):
        db, lmd = get_db_connection()
        lmd.execute("SELECT * FROM category")
        category_data = lmd.fetchall()
        lmd.close()
        formatted_category_data = [{
            'id': item[0],
            'category': item[1]
        } for item in category_data]

        return jsonify(formatted_category_data)
    
class ListAssetExcept(Resource):
    @check_whitelist
    def get(self):
        db, lmd = get_db_connection()
        lmd.execute("SELECT * FROM assets WHERE status NOT IN ('in Loans', 'on Request', 'unAvailable')")
        data = lmd.fetchall()
        lmd.close()
        formatted_data = [{
            'no': item[0],
            'id': item[1],
            'name': item[2],
            'description': item[3],
            'brand': item[4],
            'model': item[5],
            'status': item[6],
            'location': item[7],
            'category': item[8],
            'sn': item[9],
            'image_path': item[10],
            'qrcode_path': item[11],
            'created_at': item[12].strftime("%Y-%m-%d %H:%M:%S"),
        } for item in data]
        json_data = json.dumps(formatted_data)
        return jsonify(formatted_data)