from flask import request
from app.config_db import get_db_connection
import pandas as pd
from flask_restful import Resource
from werkzeug.utils import secure_filename
from flask import current_app
from app.config_flask import check_whitelist
import os

class UploadCsv(Resource):
    @check_whitelist
    def post(self):
        db, lmd = get_db_connection()
        image_path = 'https://asset.lintasmediadanawa.com:8443/static/Default/images.jfif'
        uploaded_file = request.files['csvFile']

        if not uploaded_file:
            return {'message': 'No file uploaded', "Status": "warning"}, 400

        col_names = ['id', 'asset', 'name', 'description', 'brand', 'model', 'status', 'location', 'category', 'serialnumber']
        
        try:
            header = pd.read_csv(uploaded_file, header=None, nrows=1)
            if header.shape[1] == len(col_names) and header.columns.to_list() == list(range(len(col_names))):
                data = pd.read_csv(uploaded_file, names=col_names, header=None, skiprows=1)
        except:
            header = pd.read_excel(uploaded_file, header=None, nrows=1)
            if header.shape[1] == len(col_names) and header.columns.to_list() == list(range(len(col_names))):
                if header[0][0] == col_names[0] and header[1][0] == col_names[1] and header[2][0] == col_names[2] and header[3][0] == col_names[3] and header[4][0] == col_names[4] and header[5][0] == col_names[5] and header[6][0] == col_names[6] and header[7][0] == col_names[7] and header[8][0] == col_names[8] and header[9][0] == col_names[9]:
                    data = pd.read_excel(uploaded_file, names=col_names, header=None, skiprows=1)
                    return {'message': 'Import Data berhasil', "Status": "success"}
                else:
                    return {'message': 'Header tidak sesuai dari yang seharusnya', 'Status': 'error'}, 400
            else:
                return {'message': 'Jumlah Kolom berlebih dari yang seharusnya', 'Status': 'error'}, 400
            

        try:
            filename = secure_filename(uploaded_file.filename)
            upload_folder = current_app.config['UPLOAD_FOLDER']
            os.makedirs(upload_folder, exist_ok=True)
            uploaded_file.save(os.path.join(upload_folder, filename))

            for _, row in data.iterrows():
                row['id'] = int(row['id'])
                lmd.execute('INSERT INTO assets (asset, name, description, brand, model, status, location, category, serialnumber, photo) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)', (row['asset'], row['name'], row['description'], row['brand'], row['model'], row['status'], row['location'], row['category'], row['serialnumber'], image_path))
                db.commit()

            return {'message': 'Import telah berhasil', "Status": "success"}, 200
        except Exception as e: 
            db.rollback()
            return {'message': 'Gagal mengimpor data', 'error': str(e)}, 500
        finally:
            lmd.close()
