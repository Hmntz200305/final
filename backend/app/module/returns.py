from app.config_db import get_db_connection
from app.config_flask import SECRET_KEY, check_whitelist
from flask_restful import Resource
from flask import request,jsonify
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
                    lmd.execute('UPDATE loandata set status = %s where id = %s and email = %s', (2, selectedLoanID, email,))
                    db.commit()
                    lmd.execute('SELECT idasset from loandata where id = %s', (selectedLoanID,))
                    idasset = lmd.fetchone()[0]
                    lmd.execute('SELECT username from users where email = %s and password = %s', (email, password))
                    username = lmd.fetchone()[0]
                    lmd.execute('SELECT asset from assets where id = %s', (idasset,))
                    assetname = lmd.fetchone()[0]
                    lmd.execute('SELECT idticket from loandata where id = %s', (selectedLoanID,))
                    loandataticketid = lmd.fetchone()[0]
                    lmd.execute('SELECT email from ticketingadmin where idticket = %s', (loandataticketid,))
                    emailadmin = lmd.fetchall()
                    message = Message(f'Pengembalian Assets', sender='admin.asset@lintasmediadanawa.com', recipients=[emailadmin[0][0]])
                    message.body = f'Ticket Number {loandataticketid}\n' \
                                   f'Atas Nama {username} ingin mengembalikan Asset {assetname}\n'
                    mail.send(message)
                    message = Message(f'Pengembalian Assets', sender='admin.asset@lintasmediadanawa.com', recipients=[emailadmin[1][0]])
                    message.body = f'Ticket Number {loandataticketid}\n' \
                                   f'Atas Nama {username} ingin mengembalikan Asset {assetname}\n'
                    mail.send(message)
                    return {'message': f'Barang {assetname} diajukan pengembalian', "Status": "success"}
                except:
                    db.rollback()
                    return {'message': 'Have some error', "Status": "error"}
                
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
                

class ReturnSubmited(Resource):
    @check_whitelist
    def get(self):
        db, lmd = get_db_connection()

        token = request.headers.get('Authorization')
        if not token:
            return {'message': 'Token is missing', "Status": "error"}, 401

        payload = verify_token(token)

        if payload:
            email = payload['email']
            password = payload['password']
            if email and password:
                lmd.execute('SELECT * from ticketingadmin where email = %s', (email,))
                cekadmin = lmd.fetchall()

                ticketingadmin_list = []
                for row in cekadmin:
                    ids, idticket, username, status = row
                    ticketingadmin_list.append({
                        'id': ids,
                        'idticket': idticket,
                        'username': username,
                        'status': status
                    })
                
                if not ticketingadmin_list:
                    return False
                else:
                    ticket_list = []
    
                    idtickets = [admin_row['idticket'] for admin_row in ticketingadmin_list]
                    placeholders = ', '.join(['%s'] * len(idtickets))
                    query = 'SELECT * FROM loandata ' \
                            'INNER JOIN ticketingadmin ON loandata.idticket = ticketingadmin.idticket ' \
                            'INNER JOIN assets ON loandata.idasset = assets.id ' \
                            'WHERE loandata.idticket IN ({}) AND loandata.status = 2 AND ticketingadmin.status = 1 AND ticketingadmin.email = %s'.format(placeholders)
    
                    params = idtickets + [email]
                    lmd.execute(query, params)
                    cekticket = lmd.fetchall()
                    
                    total_records = len(cekticket)

    
                    for data in cekticket:
                        id, idtickets, idasset, nameasset, leasedate, returndate, username, email, status, deleted, idticketingadmin, idticketadmin, admin_email, admin_status, idassets, assets, assetname, assetdesc, assetbrand, assetmodel, assetstatus, assetlocation, assetcategory, assetsn, assetphoto, assetqrcode, assetcreated = data
                        ticket_list.append({
                            'idticket': idtickets,
                            'idasset': idasset,
                            'name': username,
                            'leasedate': leasedate,
                            'returndate': returndate,
                            'username': username,
                            'email': email,
                            'status': status,
                            'deleted': deleted,
                            'idticketingadmin': idticketingadmin,
                            'idticketadmin': idticketadmin,
                            'admin_email': admin_email,
                            'admin_status': admin_status,
                            'idassets': idassets,
                            'assets': assets,
                            'assetname': assetname,
                            'assetdesc': assetdesc,
                            'assetbrand': assetbrand,
                            'assetmodel': assetmodel,
                            'assetstatus': assetstatus,
                            'assetlocation': assetlocation,
                            'assetcategory': assetcategory,
                            'assetsn': assetsn,
                            'assetphoto': assetphoto,
                            'assetcreated': assetcreated
                        })
    
                    lmd.close()
                    return jsonify({'total_records': total_records, 'ticket_list': ticket_list})
                    # return jsonify(ticket_list)
            
class ReturnApprove(Resource):
    @check_whitelist
    def put(self, selectedTicketId):
        db, lmd = get_db_connection()
        
        token = request.headers.get('Authorization')
        if not token:
            return {'message': 'Token is missing', 'Status': 'error'}, 401

        payload = verify_token(token)

        if payload:
            email = payload['email']
            password = payload['password']
            if email and password:
                if selectedTicketId:
                    try:
                        TicketID = selectedTicketId
                        lmd.execute('SELECT username from users where email = %s', (email,))
                        admin = lmd.fetchone()[0]
                        lmd.execute('SELECT username,email,idasset,nameasset from loandata where idticket = %s', (TicketID,))
                        username,email,idasset,nameasset = lmd.fetchone()
                        lmd.execute('UPDATE loandata set status = %s where idticket = %s', ('1', TicketID))
                        db.commit()
                        lmd.execute('UPDATE assets set status = %s where id = %s', ('Available', idasset))
                        db.commit()
                        lmd.close()
                        db.close()          
                        message = Message(f'Pengembalian Assets', sender='admin.asset@lintasmediadanawa.com', recipients=[email])
                        message.body = f'Ticket Number {TicketID}\n' \
                                       f'Admin Atas Nama {admin} telah mengizinkan pengembalian Asset {nameasset}\n'
                        mail.send(message)
                        return {'message': f'Return Request TicketID {TicketID} has approve', 'Status': 'success'}
                    except Exception as e:
                        db.rollback()
                        error_message = str(e)
                        traceback.print_exc()  # Mencetak pesan kesalahan traceback
                        return {'message': f'Error: {error_message}', 'Status': 'error'}
                else:
                    return {'message': 'Ticket Invalid', 'Status': 'error'}            
            
                
class ReturnDecline(Resource):
    @check_whitelist
    def put(self, selectedTicketId):
        db, lmd = get_db_connection()
        
        token = request.headers.get('Authorization')
        if not token:
            return {'message': 'Token is missing', 'Status': 'error'}, 401

        payload = verify_token(token)

        if payload:
            email = payload['email']
            password = payload['password']
            if email and password:
                if selectedTicketId:
                    try:
                        TicketID = selectedTicketId
                        lmd.execute('SELECT username from users where email = %s', (email,))
                        admin = lmd.fetchone()[0]
                        lmd.execute('SELECT username,email,nameasset from loandata where idticket = %s', (TicketID,))
                        username,email,nameasset = lmd.fetchone()
                        lmd.execute('UPDATE loandata set status = %s where idticket = %s', ('0', TicketID))
                        db.commit()
                        lmd.close()
                        db.close()          
                        message = Message(f'Penolakan Pengembalian Assets', sender='admin.asset@lintasmediadanawa.com', recipients=[email])
                        message.body = f'Ticket Number {TicketID}\n' \
                                       f'Admin Atas Nama {admin} tidak mengizinkan pengembalian Asset {nameasset}\n'
                        mail.send(message)
                        return {'message': f'Return Request TicketID {TicketID} has decline', 'Status': 'success'}
                    except Exception as e:
                        db.rollback()
                        error_message = str(e)
                        traceback.print_exc()  # Mencetak pesan kesalahan traceback
                        return {'message': f'Error: {error_message}', 'Status': 'error'}
                else:
                    return {'message': 'Ticket Invalid', 'Status': 'error'}