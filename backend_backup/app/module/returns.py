from app.config_db import get_db_connection
from app.config_flask import SECRET_KEY, check_whitelist
from flask_restful import Resource
from flask import request
from app.config_mail import mail
from flask_mail import Message
import jwt

def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

class inLoanAssetList(Resource):
    @check_whitelist
    def get(self):
        db, lmd = get_db_connection()
        
        token = request.headers.get('Authorization')
        if not token:
            return {'message': 'Token is missing'}, 401

        payload = verify_token(token)

        if payload:
            email = payload['email']
            password = payload['password']
            if email and password:
                lmd.execute('SELECT username from users where email = %s', (email,))
                username = lmd.fetchone()[0]
                lmd.execute('SELECT id, idasset, nameasset, leasedate, returndate FROM loandata WHERE username = %s AND email = %s and status = %s', (username, email, 0,))
                inloandata = lmd.fetchall()
                
                lmd.execute("SELECT count(*) from loandata where email = %s and status = %s", (email, '0',))
                loancount = lmd.fetchone()[0]
                
                if inloandata:
                    data = []

                    for index, row in enumerate(inloandata, start=1):
                        idloandata = row[0]
                        idasset = row[1]
                        nameasset = row[2]
                        leasedate = row[3]
                        returndate = row[4]
                        leasedate_str = leasedate.isoformat()
                        returndate_str = returndate.isoformat()
                        lmd.execute('SELECT asset from assets where id = %s', (idasset,))
                        idassets = lmd.fetchone()[0]
                        lmd.execute('SELECT * from assets where id = %s', (idasset,))
                        assets = lmd.fetchone()
                        data.append({'row': index, 'id': idloandata, 'idasset': idassets, 'nameasset': nameasset, 'leasedate': leasedate_str, 'returndate': returndate_str, 'assetsid': assets[0], 'assets': assets[1], 'assetsname': assets[2], 'assetsdesc': assets[3], 'assetsbrand': assets[4], 'assetsmodel': assets[5], 'assetsstatus': assets[6], 'assetslocation': assets[7], 'assetscategory': assets[8], 'assetssn': assets[9], 'assetsphoto': assets[10]})
                
                    return {'data': data, 'loancount': loancount}
                else:
                    return {'message': 'Tidak ada data peminjaman yang ditemukan.', 'loancount': loancount}


class ReturnAsset(Resource):
    @check_whitelist
    def post(self, selectedLoanID):
        db,lmd = get_db_connection()
        
        token = request.headers.get('Authorization')
        if not token:
            return {'message': 'Token is missing'}, 401

        payload = verify_token(token)

        if payload:
            email = payload['email']
            password = payload['password']
            if email and password:
                try:
                    lmd.execute('UPDATE loandata set status = %s where id = %s and email = %s', (1, selectedLoanID, email,))
                    db.commit()
                    lmd.execute('SELECT idasset from loandata where id = %s', (selectedLoanID,))
                    idasset = lmd.fetchone()[0]
                    lmd.execute('UPDATE assets set status = %s where id = %s', ('Available', idasset,))
                    db.commit()
                    lmd.execute('SELECT username from users where email = %s and password = %s', (email, password))
                    username = lmd.fetchone()[0]
                    lmd.execute('SELECT asset from assets where id = %s', (idasset,))
                    assetname = lmd.fetchone()[0]
                    lmd.execute('SELECT idticket from loandata where id = %s', (selectedLoanID,))
                    loandataticketid = lmd.fetchone()[0]
                    lmd.execute('SELECT email from ticketingadmin where idticket = %s', (loandataticketid,))
                    emailadmin = lmd.fetchall()
                    message = Message(f'Pengembalian Assets', sender='nakatsuuchiha@gmail.com', recipients=[emailadmin[0][0]])
                    message.body = f'Ticket Number {loandataticketid}\n' \
                                   f'Atas Nama {username} telah mengembalikan Asset {assetname}\n'
                    mail.send(message)
                    message = Message(f'Pengembalian Assets', sender='nakatsuuchiha@gmail.com', recipients=[emailadmin[1][0]])
                    message.body = f'Ticket Number {loandataticketid}\n' \
                                   f'Atas Nama {username} telah mengembalikan Asset {assetname}\n'
                    mail.send(message)
                    return {'message': f'Barang {assetname} sudah dikembalikan', "Status": "success"}
                except:
                    db.rollback()
                    return {'message': 'Have some error', "Status": "error"}
        