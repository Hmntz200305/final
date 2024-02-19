from flask import request, current_app
from app.config_db import get_db_connection
import pandas as pd
from flask_restful import Resource
from werkzeug.utils import secure_filename
from flask import current_app
from app.config_flask import SECRET_KEY, UPLOAD_FOLDER, server_ip, check_whitelist
import os
import qrcode
import json

class UploadCsv(Resource):
    @check_whitelist
    def post(self):
        db, lmd = get_db_connection()
        image_path = 'https://asset.lintasmediadanawa.com:8443/static/Default/images.jfif'
        uploaded_file = request.files['csvFile']

        if not uploaded_file:
            return {'message': 'No file uploaded', "Status": "warning"}, 400

        col_names = ['id', 'asset', 'name', 'description', 'brand', 'model', 'status', 'location', 'category', 'serialnumber']
        exist_asset = []
        
        try:
            header = pd.read_csv(uploaded_file, header=None, nrows=1)
            if header.shape[1] == len(col_names) and header.columns.to_list() == list(range(len(col_names))):
                data = pd.read_csv(uploaded_file, names=col_names, header=None, skiprows=1)
        except:
            header = pd.read_excel(uploaded_file, header=None, nrows=1)
            if header.shape[1] == len(col_names) and header.columns.to_list() == list(range(len(col_names))):
                if header[0][0] == col_names[0] and header[1][0] == col_names[1] and header[2][0] == col_names[2] and header[3][0] == col_names[3] and header[4][0] == col_names[4] and header[5][0] == col_names[5] and header[6][0] == col_names[6] and header[7][0] == col_names[7] and header[8][0] == col_names[8] and header[9][0] == col_names[9]:
                    data = pd.read_excel(uploaded_file, names=col_names, header=None, skiprows=1)
                    try:
                        filename = secure_filename(uploaded_file.filename)
                        upload_folder = current_app.config['UPLOAD_FOLDER']
                        os.makedirs(upload_folder, exist_ok=True)
                        uploaded_file.save(os.path.join(upload_folder, filename))

                        for _, row in data.iterrows():
                            lmd.execute('SELECT count(*) from assets where asset = %s', (str(row['asset']),))
                            checking = lmd.fetchone()
                            if checking is None or checking[0] < 1:
                                row['id'] = int(row['id'])
                                save_path = os.path.join(current_app.config['UPLOAD_FOLDER'], str(row['asset']))
                                data_for_qrcode = {
                                    "AssetID": row['asset'],
                                    "AssetName": row['name'],
                                    "AssetDesc": row['description'],
                                    "AssetBrand": row['brand'],
                                    "AssetModel": row['model'],
                                    "AssetStatus": row['status'],
                                    "AssetLocation": row['location'],
                                    "AssetCategory": row['category'],
                                    "AssetSN": row['serialnumber']
                                }

                                json_data = json.dumps(data_for_qrcode)
                                qr = qrcode.QRCode(
                                    version=1,
                                    error_correction=qrcode.constants.ERROR_CORRECT_L,
                                    box_size=10,
                                    border=4,
                                )
                                qr.add_data(json_data)
                                qr.make(fit=True)

                                qrcode_name = 'QRCode_' + str(row['asset']) + '.png'
                                img = qr.make_image(fill_color="black", back_color="white")
                                os.makedirs(save_path, exist_ok=True)
                                img.save(os.path.join(save_path, qrcode_name))
                                link = ('https://asset.lintasmediadanawa.com:8443' + '/static/upload/' + str(row['asset']) + '/' + qrcode_name)
                                lmd.execute('INSERT INTO assets (asset, name, description, brand, model, status, location, category, serialnumber, photo, qrcode) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)', (row['asset'], row['name'], row['description'], row['brand'], row['model'], row['status'], row['location'], row['category'], row['serialnumber'], image_path, link))
                                db.commit()
                            else:
                                exist_asset.append(str(row['asset']))

                        if exist_asset:
                            db.rollback()
                            return {'message': f'{exist_asset} IDAsset sudah digunakan', 'Status': 'error'}
                        else:
                            return {'message': 'Import telah berhasil', "Status": "success"}, 200

                    except Exception as e: 
                        db.rollback()
                        return {'message': 'Gagal mengimpor data', 'error': str(e)}, 500
                    finally:
                        lmd.close()
                else:
                    return {'message': 'Header tidak sesuai dari yang seharusnya', 'Status': 'error'}, 400
            else:
                return {'message': 'Jumlah Kolom berlebih dari yang seharusnya', 'Status': 'error'}, 400
