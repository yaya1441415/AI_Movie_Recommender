from flask import Blueprint, request, jsonify, make_response, g, Response
from pymongo import MongoClient
from functools import wraps
from bson import ObjectId
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import os
import smtplib
from email.mime.text import MIMEText
import bcrypt
import datetime
import secrets
import jwt


load_dotenv() 
model = SentenceTransformer('all-MiniLM-L6-v2')
url = os.getenv("MongoDB_URL")
secret_key = os.getenv("JWT_SECRET")
SenderEmail = os.getenv("Email")
Sendpassword = os.getenv("Email_Password")



if not secret_key:
    raise ValueError("Missing JWT_SECRET in environment variables")



client = MongoClient(url)
db = client["users"]
collection = db["user"]

def Register():
    try:

        data = request.get_json()

        username = data.get('userName')
        email = data.get('email')
        password = data.get('password')
        

        existing_user = collection.find_one({"email": email})

        if existing_user:
            return jsonify({"error":"Email already exists"}), 409

        

        salt =  bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
       
        print("a")

        
        collection.insert_one({"username":username, "email": email, "password":hashed })
        
        return jsonify({
            "message": "User registered successfully",
            "email": email,
            "name":username
            }), 200


    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

def Login():
    try:
        print("qe")
        data = request.get_json()
    
        email = data.get('email')
        password = data.get('password')

        print(email)

        if not email or not password:
            print("kk")
            return jsonify({"error":"Email and password required"}), 400     
        print("p")
        user = collection.find_one({"email": email})
        print("k")
        if not user:
            print("hh")
            return jsonify({"error": "Invalid credentials"}), 401
        print("1kk")
        if not bcrypt.checkpw(password.encode('utf-8'), user['password']):
            print("aa")
            return jsonify({"error": "Invalid password"}), 401
            

        print("qq")
        #The data stored in the token.
        payload = {
            "user_id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"],
            "exp" : datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }
        print("a")
        
        # takes the payload, secret key, hashing algorith amd makes a token. usong pyJWT
        token = jwt.encode(payload, secret_key, algorithm='HS256')
        
        
        print("ss")
        
        return jsonify({
            "message": "Login successful",
            "user": {
                "email": user["email"],
                "user_id": str(user["_id"])
            },
            "token": token  # send token in response
        })


    except Exception as e:
        return jsonify({'error': str(e)}), 500

def verifyUser(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        
        
        user_id = g.jwt_data.get("user_id") or g.jwt_data.get("id")
        if not user_id:
            return jsonify({"error": "User ID missing in token"}), 401
        

            

        user = collection.find_one({"_id": ObjectId(user_id)}), 401

        if not user:
            return jsonify({"error": "User not found"}), 401
        
        g.user = user

        return f(*args, **kwargs)
    return decorated

def userLogout():
    token = request.cookies.get("token")
    print(token)

    if not token:
        return jsonify({"error" : "Missing token"}), 401
    
    try:
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        user_id = payload["user_id"]

        user = collection.find_one({"_id": ObjectId(user_id)})
            
        if not user:
            return jsonify({"error":"User doesn't exist anymore"}), 401

        
        resp = make_response(jsonify({"message": "Logged out successfully"}))
        resp.delete_cookie(
            "token",
            path="/",
            samesite="None",
            secure=True
        )

        return resp
    
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401       

def SendEmail():
    
    data = request.get_json()
    email = data.get('email')

    existingUser = collection.find_one({"email": email})
    if not existingUser:
        return jsonify({"error":"email doesn t exist"}), 400
    
    #generate a cryptographically secure random URL-safe token
    token = secrets.token_urlsafe(32)
    expiry = datetime.datetime.utcnow()+datetime.timedelta(hours=1)

    #save token in the dataSet:
    collection.update_one(
        
        {"email":email},
        {"$set":{"reset token":token, "reset_expiry":expiry}}
        
    )

    msg = MIMEText(f"Click here to resetyour password:http://localhost:5173/ResetPassword?token={token} ")
    msg['Subject'] = 'Password Reset Request'
    msg['From'] = SenderEmail
    msg["To"] = email

    #establishes a connection to GMAIL's SMTP server 
    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls() #Enables TLS encryption
        server.login(SenderEmail, Sendpassword) #Authenticate WIth SMTP server
        server.send_message(msg)

    return jsonify({"message": "Confirmation Email Was Sent"})

def confirm():

    data = request.get_json()
    token = data.get("token")
    new_password = data.get("password")
    

    if not token or not new_password:
        return jsonify({"error": "Missing token or password"}), 400
    
    #find the user
    user = collection.find_one({"reset token":token})
    print("oo")
    if not user: 
        print("ll")
        return jsonify({"error": "INvalid or expired token"}), 400
    
    if datetime.datetime.utcnow() > user["reset_expiry"]:
        print("kk")
        return jsonify({"error": "Token has expired"}), 400
    
    print(token)
    print(new_password)
    #3. Hash The new Password
    hashed_pw =  bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt())

    #Update password and remove token
    collection.update_one(
        {"_id":user["_id"]},
        {"$set":{"password":hashed_pw},
        "$unset":{"reset_token":"", "reset_expiry":""}}
    )

    return jsonify({"message": "Password reset successful"})

def getPrompt():
    email = request.args.get("email")

    user = collection.find_one({"email":email})

    description = user["description"]

    if not description:
        return jsonify({"error": "user has nevr made a prompt."})
    
    return jsonify({"description":description})


