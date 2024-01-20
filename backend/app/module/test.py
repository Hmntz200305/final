from flask_restful import Resource
from app.config_flask import check_whitelist
from flask import request

class test(Resource):
    @check_whitelist
    def post(self):
        data = request.json
        print('what?')
        print(data)
        return data