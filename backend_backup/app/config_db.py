import mysql.connector

def get_db_connection():
    db_config = {
        "host": "182.23.45.72",
        "user": "assetlmd",
        "password": "LmD_2&0%2*3#!@55#@00!",
        "database": "manageasset",
        "port": 5110,
    }
    db = mysql.connector.connect(**db_config)
    lmd = db.cursor()
    return db, lmd