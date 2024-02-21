from flask_mail import Mail

mail = Mail()

def configure_mail(app):
    
    app.config['MAIL_SERVER'] = 'mail.lintasmediadanawa.com' 
    app.config['MAIL_PORT'] = 587  
    app.config['MAIL_USE_TLS'] = True 
    app.config['MAIL_USE_SSL'] = False  # Tidak menggunakan SSL jika tidak diaktifkan SPA
    app.config['MAIL_USERNAME'] = 'admin.asset@lintasmediadanawa.com' 
    app.config['MAIL_PASSWORD'] = 'DilarangMasuk1!'
    app.config['MAIL_DEFAULT_SENDER'] = 'admin.asset@lintasmediadanawa.com'

    mail.init_app(app)
