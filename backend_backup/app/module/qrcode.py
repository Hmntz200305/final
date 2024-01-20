from flask import request, current_app
from flask_restful import Resource
from app.config_flask import SECRET_KEY, QRCode_FOLDER, server_ip, check_whitelist
from werkzeug.utils import secure_filename
from app.config_db import get_db_connection
from app.config_mail import mail  
from flask_mail import Message
import qrcode
import json
import os
import jwt
import traceback

def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def validate_lease(ids, name, leasedate, returndate, location, email_user, note, admin1, admin2):
    if not ids or not name or not leasedate or not returndate or not location or not email_user or not note or not admin1 or not admin2:
        return False
    return True

class QrGenerator(Resource):
    @check_whitelist
    def post(self):
        data = request.form
        
        if any(value == "" for value in data.values()):
            return {"message": "All fields must be filled", "Status": "error"}, 400
        
        required_fields = ["AssetID", "AssetName", "AssetDesc", "AssetBrand", "AssetModel", "AssetStatus", "AssetLocation", "AssetCategory", "AssetSN"]
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return {"message": f"Missing required fields: {', '.join(missing_fields)}", "Status": "error"}, 400

        asset_id = data["AssetID"]
        save_path = os.path.join(current_app.config['QRCode_FOLDER'], asset_id)

        # Memeriksa apakah folder sudah ada
        # if os.path.exists(save_path):
        #     return {"message": f"AssetID {asset_id} has been used. Use another AssetID.", "Status": "warning"}, 400

        # Membuat folder
        os.makedirs(save_path, exist_ok=True)

        data_to_save = {
            "AssetID": asset_id,
            "AssetName": data["AssetName"],
            "AssetDesc": data["AssetDesc"],
            "AssetBrand": data["AssetBrand"],
            "AssetModel": data["AssetModel"],
            "AssetStatus": data["AssetStatus"],
            "AssetLocation": data["AssetLocation"],
            "AssetCategory": data["AssetCategory"],
            "AssetSN": data["AssetSN"]
        }
        
        json_data = json.dumps(data_to_save)
        
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(json_data)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        img.save(os.path.join(save_path, asset_id + '.png'))
        
        link = f"https://asset.lintasmediadanawa.com:8443/static/QRCode/{asset_id}/{asset_id}.png"
        return {"message": "QR Code has been created", "qr": link, "Status": "success"}, 200

class QrScanner(Resource):
    @check_whitelist
    def post(self):
        data = request.json
        
        if any(value == "" for value in data.values()):
            return {"message": "All fields must be filled"}, 400
        
        required_fields = ["AssetID", "AssetName", "AssetDesc", "AssetBrand", "AssetModel", "AssetStatus", "AssetLocation", "AssetCategory", "AssetSN"]
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return {"message": f"Missing required fields: {', '.join(missing_fields)}", "Status": "warning"}, 400
        
        AssetID = data["AssetID"]
        AssetName = data["AssetName"]
        AssetDesc=  data["AssetDesc"]
        AssetBrand = data["AssetBrand"]
        AssetModel = data["AssetModel"]
        AssetStatus = data["AssetStatus"]
        AssetLocation = data["AssetLocation"]
        AssetCategory = data["AssetCategory"]
        AssetSN = data["AssetSN"]
            
        db, lmd = get_db_connection()
        
        # Periksa apakah AssetID sudah ada
        lmd.execute('SELECT COUNT(*) FROM assets WHERE asset = %s', (AssetID,))
        validate = lmd.fetchone()[0]
        
        if validate > 0:
            lmd.close()
            return {"message": "AssetID already in use", "Status": "error"}, 409
        
        try:
            # Masukkan data ke dalam tabel assets
            image_path = (current_app.config['server_ip'] + '/static/Default/images.jfif')
            save_path = os.path.join(current_app.config['UPLOAD_FOLDER'], AssetID)
            data_qrcode = {
                "AssetID": AssetID,
                "AssetName": data["AssetName"],
                "AssetDesc": data["AssetDesc"],
                "AssetBrand": data["AssetBrand"],
                "AssetModel": data["AssetModel"],
                "AssetStatus": data["AssetStatus"],
                "AssetLocation": data["AssetLocation"],
                "AssetCategory": data["AssetCategory"],
                "AssetSN": data["AssetSN"]
            }

            json_data = json.dumps(data_qrcode)

            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(json_data)
            qr.make(fit=True)

            qrcode_name = 'QRCode_' + AssetID + '.png'
            img = qr.make_image(fill_color="black", back_color="white")
            os.makedirs(save_path, exist_ok=True)
            img.save(os.path.join(save_path, qrcode_name))

            link = ('https://asset.lintasmediadanawa.com:8443' + '/static/upload/' + AssetID + '/' + qrcode_name)
            lmd.execute('INSERT INTO assets (asset, name, description, brand, model, status, location, category, serialnumber, photo, qrcode) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)',
                        (AssetID, AssetName, AssetDesc, AssetBrand, AssetModel, AssetStatus, AssetLocation, AssetCategory, AssetSN, image_path, link))
            
            db.commit()
            lmd.close()
            
            return {"message": "QR Code successfully, Asset has been inputed", "Status": "success"}, 200
        except Exception as e:
            db.rollback()
            Error = ("message:", (str(e)))
            print(Error)
            return {"message": {"message": Error}, "Status": "error"}, 409
        
class LeaseTicketScanner(Resource):
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
                data = request.form 
                ids = data.get('AssetID')
                name = data.get('Name')
                leasedate = data.get('CheckoutDate')
                returndate = data.get('CheckinDate')
                location = data.get('Location')
                email_user = data.get('Email')
                note = data.get('Note')
                admin1 = data.get('Admin1')
                admin2 = data.get('Admin2')
                if not validate_lease(ids, name, leasedate, returndate, location, email_user, note, admin1 ,admin2):
                    return {"message": "Diharap mengisi semua Form", "Status": "warning"}, 400
                if data:
                    lmd.execute("SELECT id from assets where asset = %s and status = %s", (ids, 'Available'))
                    cekstatus_result = lmd.fetchone()
                    if cekstatus_result:
                        cekstatus = cekstatus_result[0]
                        print(cekstatus)
                        try:
                            lmd.execute('INSERT INTO ticket (idasset, name, leasedate, returndate, location, email, note, status, deleted) VALUES (%s, %s ,%s, %s, %s, %s, %s, %s, %s)', (cekstatus, name, leasedate, returndate, location, email_user, note, 0, 0))
                            db.commit()
                            lmd.execute('UPDATE assets set status = %s where id = %s', ('on Request', cekstatus))
                            db.commit()
                            lmd.execute('SELECT LAST_INSERT_ID()')
                            idticket = lmd.fetchone()[0]
                            lmd.execute('select asset from assets where id = %s', (cekstatus,))
                            assetname = lmd.fetchone()[0]
                            lmd.execute('INSERT INTO ticketingadmin (idticket, email, status) values (%s, %s, %s)', (idticket, admin1, 0))
                            db.commit()
                            message = Message(f'Peminjaman Barang LMD', sender='nakatsuuchiha@gmail.com', recipients=[admin1])
                            message.body = f'Ticket Number {idticket}\n' \
                                           f'Atas Nama {name} ingin meminjam barang {assetname}\n' \
                                            'Klick Link untuk tindak/informasi lebih lanjut: https://asset.lintasmediadanawa.com:8443/submitted'
                            mail.send(message)
                            lmd.execute('INSERT INTO ticketingadmin (idticket, email, status) values (%s, %s, %s)', (idticket, admin2, 2))
                            db.commit()
                        except Exception as error:
                            db.rollback()
                            print({str(error)})
                            return {"message": "Asset sedang tidak tersedia saat ini", "Status": "error"} ,409
                    else:
                        return {'message': 'Asset sedang tidak tersedia saat ini', "Status": "warning"}, 409
                lmd.close()
                db.close()
                return {"message": "Lease successfully Send", "Status": "success"}, 200
            else:
                return {"message": "You don't have access to run this command", "Status": "error"}, 403
            
class QrScannerCheck(Resource):
    @check_whitelist
    def post(self):
        data = request.json
        
        if any(value == "" for value in data.values()):
            return {"message": "All fields must be filled"}, 400
        
        required_fields = ["AssetID", "AssetName", "AssetDesc", "AssetBrand", "AssetModel", "AssetStatus", "AssetLocation", "AssetCategory", "AssetSN"]
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return {"message": f"Missing required fields: {', '.join(missing_fields)}", "Status": "warning"}, 400
        
        AssetID = data["AssetID"]
        AssetName = data["AssetName"]
        AssetDesc=  data["AssetDesc"]
        AssetBrand = data["AssetBrand"]
        AssetModel = data["AssetModel"]
        AssetStatus = data["AssetStatus"]
        AssetLocation = data["AssetLocation"]
        AssetCategory = data["AssetCategory"]
        AssetSN = data["AssetSN"]
            
        db, lmd = get_db_connection()
        try:
            lmd.execute('SELECT id,asset,name,description,brand,model,status,location,category,serialnumber FROM assets WHERE asset = %s', (AssetID,))
            dataasset = lmd.fetchone()
            ids, asset, name, description, brand, model, status, location, category, serialnumber = dataasset
            result = {
                'no': ids,
                'AssetID': asset,
                'AssetName': name,
                'AssetDesc': description,
                'AssetBrand': brand,
                'AssetModel': model,
                'AssetStatus': status,
                'AssetLocation': location,
                'AssetCategory': category,
                'AssetSN': serialnumber
            }
            return {"message": "Asset Ditemukan", "Status": "success", "DataAsset": result}
        except:
            db.rollback()
            return {"message": "Error", "Status": "error"}, 409