from flask import Flask, request, jsonify, g
from functools import wraps
import jwt
import os


def verifyToken(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token =  request.cookies.get("token")

        if not token or token.strip() == "":
            return jsonify({"message": "Token Not Received"}), 401
        
        try:

            decoded = jwt.decode(token, os.getenv('JWT_SECRET'), algorithms=["HS256"])
            g.jwt_data = decoded

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token Expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message":"Invalid Token"}), 401
        
        #what actually executes your route code after the middleware logic runs
        #middleware logic
        return f(*args, **kwargs)
    
    return decorated
