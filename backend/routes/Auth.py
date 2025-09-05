from flask import Blueprint,g, request, jsonify
from pymongo import MongoClient
from Token.tokenManager import verifyToken
from controllers.user_controllers import Register, Login, verifyUser, userLogout,  SendEmail, confirm, getPrompt
from controllers.coach import analysis, addMovie, GetLikedMovies

Auth_bp = Blueprint("Auth",__name__ )

@Auth_bp.route("/register", methods = ['POST'])
def R():
    return Register()


@Auth_bp.route('/login', methods = ['POST'])
def L():
    return Login()

@Auth_bp.route('/Auth-Status')
@verifyToken
@verifyUser
def checkStatus():
    return jsonify({"message" : "OK", "name":g.user["username"], "email":g.user["email"]}), 200


@Auth_bp.route("/logout", methods = ["POST"])
def logoutUser():
    return userLogout()

@Auth_bp.route("/Description", methods = ["POST"])
def Analyze():
    return analysis()


@Auth_bp.route("/Forgotpassword", methods = ["POST"])
def Send():    
    return SendEmail()

@Auth_bp.route("/reset", methods = ["Post"])
def confirmPass():
    return confirm()


@Auth_bp.route("/Prompt", methods= ["GET"])
def Prompt():
    return getPrompt()

@Auth_bp.route("/movies", methods = ["POST"])
def movies():
    return addMovie()


@Auth_bp.route("/GetMovies", methods = ["GET"])
def GetMovies():
    return GetLikedMovies()