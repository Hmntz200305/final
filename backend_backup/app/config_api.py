from flask_cors import CORS
from flask_restful import Api

def configure_cors(app):
    CORS(app, resources={
        r"/*/*": {
            "origins": ["https://asset.lintasmediadanawa.com", "https://asset.lintasmediadanawa.com:2096", "https://asset.lintasmediadanawa.com:8443"]
        }
    })

def configure_api(app):
    api = Api(app)
    return api