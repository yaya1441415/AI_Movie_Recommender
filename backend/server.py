from flask import Flask, send_from_directory
from flask_cors import CORS
from routes.Auth import Auth_bp;
from dotenv import load_dotenv;

load_dotenv() 
app = Flask(__name__)

CORS(app, supports_credentials=True, origins=["http://localhost:5173"])


app.register_blueprint(Auth_bp)

if __name__ == "__main__":
    app.run(debug=True)


