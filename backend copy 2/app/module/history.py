from app.config_db import get_db_connection
from app.config_flask import check_whitelist
from flask_restful import Resource

class HistoryTicket(Resource):
    @check_whitelist
    def get(self):
        db, lmd = get_db_connection()
        
        # Ticket Checking
        lmd.execute('SELECT * from ticket')
        tickets = lmd.fetchall()
        
        ticket_list = []
        for row, ticket_data in enumerate(tickets, start=1):
            idticket, idasset, name, leasedate, returndate, location, email, note, status, deleted = ticket_data
            
            # Get email addresses of admins for this ticket
            lmd.execute('SELECT email from ticketingadmin where idticket = %s', (idticket,))
            email_admin = lmd.fetchall() 
            
            username_admin1 = username_admin2 = None  # Inisialisasi variabel

            if email_admin:
                lmd.execute('SELECT username from users where email = %s', (email_admin[0][0],))
                username_admin1 = lmd.fetchone()
                if len(email_admin) > 1:
                    lmd.execute('SELECT username from users where email = %s', (email_admin[1][0],))
                    username_admin2 = lmd.fetchone()

            if status == 1:
                status = 'Approved'
            elif status == 2:
                status = 'Decline'
            else:
                status = 'on Request'

            # Asset Information
            lmd.execute('SELECT * from assets where id = %s', (idasset,))
            assetinformation = lmd.fetchone()
            
            # Create a dictionary for each ticket and add it to the list
            ticket_data = {
                'no': row,  # Menambahkan nomor baris
                'idticket': idticket,
                'idasset': idasset,
                'name': name,
                'leasedate': str(leasedate),
                'returndate': str(returndate),
                'location': location,
                'email': email,
                'note': note,
                'status': status,
                'admin1': username_admin1[0] if username_admin1 else None,
                'admin2': username_admin2[0] if username_admin2 else None,
                'asset': assetinformation[1],
                'assetname': assetinformation[2],
                'assetdescription': assetinformation[3],
                'assetbrand': assetinformation[4],
                'assetmodel': assetinformation[5],
                'assetstatus': assetinformation[6],
                'assetlocation': assetinformation[7],
                'assetcategory': assetinformation[8],
                'assetsn': assetinformation[9],
                'assetphoto': assetinformation[10],
            }
            ticket_list.append(ticket_data)
    
        return ticket_list, 200


class HistoryLoanData(Resource):
    @check_whitelist
    def get(self):
        db, lmd = get_db_connection()
        
        # Ticket Checking
        lmd.execute('SELECT * from loandata where status = %s', (0,))
        loandata = lmd.fetchall()
        
        loandata_list = []
        for row, row_data in enumerate(loandata, start=1):
            idloandata, idticket, idasset, nameasset, leasedate, returndate, username, email, status, deleted = row_data

            if status == 0:
                status = 'In Loans'
            else:
                status = '...'

            # Asset Information
            lmd.execute('SELECT * from assets where id = %s', (idasset,))
            assetinformation = lmd.fetchone()
            
            # Create a dictionary for each ticket and add it to the list
            loan_data = {
                'no': row,  # Menambahkan nomor baris
                'idticket': idticket,
                'idasset': idasset,
                'name': username,
                'leasedate': str(leasedate),
                'returndate': str(returndate),
                'email': email,
                'status': status,
                'asset': assetinformation[1],
                'assetname': assetinformation[2],
                'assetdescription': assetinformation[3],
                'assetbrand': assetinformation[4],
                'assetmodel': assetinformation[5],
                'assetstatus': assetinformation[6],
                'assetlocation': assetinformation[7],
                'assetcategory': assetinformation[8],
                'assetsn': assetinformation[9],
                'assetphoto': assetinformation[10],
            }
            loandata_list.append(loan_data)
    
        return loandata_list, 200
