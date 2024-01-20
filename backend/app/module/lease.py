from app.config_db import get_db_connection
from flask_restful import Resource
from flask import request, jsonify
from app.config_flask import SECRET_KEY, check_whitelist
from app.config_mail import mail  
from flask_mail import Message
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

class LeaseTicket(Resource):
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
                try:
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
                        return {"message": "Data is incomplete", "Status": "warning"}, 400
                    if data:
                        lmd.execute('INSERT INTO ticket (idasset, name, leasedate, returndate, location, email, note, status, deleted) VALUES (%s, %s ,%s, %s, %s, %s, %s, %s, %s)', (ids, name, leasedate, returndate, location, email_user, note, 0, 0))
                        db.commit()

                        lmd.execute('UPDATE assets set status = %s where id = %s', ('on Request', ids))
                        db.commit()

                        lmd.execute('SELECT LAST_INSERT_ID()')
                        idticket = lmd.fetchone()[0]
                        
                        lmd.execute('select asset from assets where id = %s', (ids,))
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

                    lmd.close()
                    db.close()
                    return {"message": "Lease successfully Send", "Status": "success"}, 200
                # except:
                #     db.rollback()
                #     return {"message": "Error Mail", "Status": "error"}
                except Exception as error:
                    db.rollback()
                    return {"message": f"Error Mail: {str(error)}", "Status": "error"}

            else:
                return {"message": "You don't have access to run this command", "Status": "error"}, 403


class LeaseSubmited(Resource):
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

                ticket_list = []

                idtickets = [admin_row['idticket'] for admin_row in ticketingadmin_list]
                placeholders = ', '.join(['%s'] * len(idtickets))
                query = 'SELECT * FROM ticket ' \
                        'INNER JOIN ticketingadmin ON ticket.idticket = ticketingadmin.idticket ' \
                        'INNER JOIN assets ON ticket.idasset = assets.id ' \
                        'WHERE ticket.idticket IN ({}) AND ticket.status = 0 AND ticketingadmin.status = 0 AND ticketingadmin.email = %s'.format(placeholders)

                params = idtickets + [email]
                lmd.execute(query, params)
                cekticket = lmd.fetchall()

                for data in cekticket:
                    idtickets, idasset, name, leasedate, returndate, location, email, note, status, deleted, idticketingadmin, idticketadmin, admin_email, admin_status, idassets, assets, assetname, assetdesc, assetbrand, assetmodel, assetstatus, assetlocation, assetcategory, assetsn, assetphoto, assetqrcode, assetcreated = data
                    ticket_list.append({
                        'idticket': idtickets,
                        'idasset': idasset,
                        'name': name,
                        'leasedate': leasedate,
                        'returndate': returndate,
                        'location': location,
                        'email': email,
                        'note': note,
                        'status': status,
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

        return jsonify(ticket_list)

class TicketApprove(Resource):
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
                try:
                    if selectedTicketId:
                        data = request.form
                        SelectedTicketingAdmin = data.get('SelectedTicketingAdmin')
                        if data:
                            TicketID = selectedTicketId
                            lmd.execute('SELECT idasset,leasedate,returndate,name,email from ticket where idticket = %s', (TicketID,))
                            data = lmd.fetchone()
                            lmd.execute('SELECT asset from assets where id = %s', (data[0],))
                            assetname = lmd.fetchone()[0]
                            lmd.execute('SELECT email from ticketingadmin where idticket= %s ORDER BY id ASC LIMIT %s', (SelectedTicketingAdmin, 1,))
                            fetch_ticketingadmin = lmd.fetchone()[0]
                            lmd.execute('SELECT username from users where email = %s', (fetch_ticketingadmin,))
                            usernameadmin1 = lmd.fetchone()[0]
                            lmd.execute('SELECT email FROM ticketingadmin WHERE idticket = %s ORDER BY id ASC LIMIT %s OFFSET %s', (SelectedTicketingAdmin, 1, 1,))
                            fetch_ticketingadmin_2 = lmd.fetchone()[0]
                            lmd.execute('SELECT username from users where email = %s', (fetch_ticketingadmin_2,))
                            usernameadmin2 = lmd.fetchone()[0]
                            if fetch_ticketingadmin == email:
                                lmd.execute('UPDATE ticketingadmin set status = %s where idticket = %s and email = %s', ('1', SelectedTicketingAdmin, email))
                                db.commit()
                                lmd.execute('SELECT email FROM ticketingadmin WHERE idticket = %s ORDER BY id ASC LIMIT %s OFFSET %s', (SelectedTicketingAdmin, 1, 1))
                                result = lmd.fetchone()[0]
                                if result:
                                    admin2_email = result
                                    lmd.execute('UPDATE ticketingadmin SET status = %s WHERE email = %s and idticket = %s', (0, admin2_email, SelectedTicketingAdmin,))
                                    db.commit()
                                    message = Message(f'Peminjaman Barang LMD', sender='nakatsuuchiha@gmail.com', recipients=[admin2_email])
                                    message.body = f'Ticket Number {selectedTicketId}\n' \
                                                   f'Atas Nama {data[3]} ingin meminjam barang {assetname}\n' \
                                                   f'Admin Pertama atas nama {usernameadmin1}({fetch_ticketingadmin}) telah menyetujui Pengajuan ini\n' \
                                                        'Klick Link untuk tindak/informasi lebih lanjut: https://asset.lintasmediadanawa.com/submitted'
                                    mail.send(message)
                                else:
                                    db.rollback()
                                    return {'message' : 'Admin ke dua tidak ditemukan', 'Status': 'error'}
                            if fetch_ticketingadmin_2 == email:
                                lmd.execute('UPDATE ticketingadmin set status = %s where idticket = %s and email = %s', ('1', SelectedTicketingAdmin, email))
                                db.commit()
                                lmd.execute('SELECT status FROM ticketingadmin WHERE idticket = %s ORDER BY id ASC LIMIT %s OFFSET %s', (SelectedTicketingAdmin, 1, 1,))
                                ticketingadmin_status_2 = lmd.fetchone()[0]
                                if fetch_ticketingadmin_2 == email and ticketingadmin_status_2 == 1:
                                    lmd.execute('UPDATE ticket set status = %s where idticket = %s', ('1', TicketID))
                                    db.commit()
                                    lmd.execute('UPDATE assets set status = %s where id = %s', ('in Loans', data[0]))
                                    db.commit()
                                    lmd.execute('SELECT name from assets where id = %s', (data[0],))
                                    nameasset = lmd.fetchone()[0]
                                    lmd.execute('INSERT INTO loandata (idticket, idasset, nameasset, leasedate, returndate, username, email, status, deleted) VALUES (%s, %s, %s, %s ,%s ,%s, %s ,%s ,%s)', (selectedTicketId, data[0], nameasset, data[1], data[2], data[3], data[4], '0', '0'))
                                    db.commit()
                                    message = Message(f'Peminjaman Barang LMD (Approved)', sender='nakatsuuchiha@gmail.com', recipients=[data[4]])
                                    message.body = f'Ticket Number {selectedTicketId}\n' \
                                                   f'Meminjam Barang {assetname}\n' \
                                                   f'Admin Pertama atas nama {usernameadmin1} ({fetch_ticketingadmin}) dan Admin Kedua atas nama {usernameadmin2} ({fetch_ticketingadmin_2})telah menyetujui Pengajuan ini\n'
                                    mail.send(message)
                            lmd.close()
                            db.close()          
                            return {'message': f'TicketID  {TicketID} Approved', 'Status': 'success'}
                        else:
                            return {'message': 'Data Invalid', 'Status': 'error'}
                    else:
                        return {'message': 'Ticket Invalid', 'Status': 'error'}
                except Exception as e:
                    db.rollback()
                    error_message = str(e)
                    traceback.print_exc()  # Mencetak pesan kesalahan traceback
                    return {'message': f'Error: {error_message}', 'Status': 'error'}

class TicketDecline(Resource):
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
                    TicketID = selectedTicketId
                    lmd.execute('SELECT idasset from ticket where idticket = %s', (TicketID,))
                    fetch_ticket = lmd.fetchone()[0]
                    lmd.execute('UPDATE ticket set status = %s where idticket = %s', ('2', TicketID))
                    db.commit()
                    lmd.execute('UPDATE ticketingadmin set status = %s where idticket = %s', ('2', TicketID))
                    db.commit()
                    lmd.execute('UPDATE assets set status = %s where id = %s', ('Available', fetch_ticket))
                    db.commit()
                    lmd.close()
                    db.close()          
                    
                    return {'message': f'TicketID  {TicketID} has decline', 'Status': 'success'}
                else:
                    return {'message': 'Ticket Invalid', 'Status': 'error'}