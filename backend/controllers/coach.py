from flask import Blueprint, request, jsonify, make_response, g, Response
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
import pandas as pd
import numpy as np
import jwt
import os
import faiss
from sklearn.cluster import MiniBatchKMeans
from controllers.processing import df, kmeans, cluster_indexes


url = os.getenv("MongoDB_URL")
secret_key = os.getenv("JWT_SECRET")
client = MongoClient(url)
db = client["users"]
collection = db["user"]
model = SentenceTransformer('all-MiniLM-L6-v2')


def analysis():
    try:
        
        #Get User input
        data = request.get_json()
        description = data.get('description')
        email = data.get('email')

    
        #Get embedding description.
        User_embedding = model.encode(description).astype('float32')

        #find the nearest cluster to the user. Predicts which cluster 
        #a given user embedding belongs to using a pre-trained model
        user_cluster = kmeans.predict(User_embedding.reshape(1,-1).astype('float64'))[0]
        
        index = cluster_indexes[user_cluster]
        #number of nearest neighbors you can retreive.
        k =min(4, index.ntotal)
        
        #reshape user embedding into 2D array, and perform nearest neighbor search in the FAISS index.
        distances, indices = index.search(User_embedding.reshape(1,-1),k)
        
        #retrieve the movies from database.
        cluster_movies = df[df['cluster'] == user_cluster].reset_index()
        
        recommended_movies = cluster_movies.iloc[indices[0]]
        
        

        movie = recommended_movies[['title']].values 
        json_data =movie.tolist() #converts to list 

        collection.update_one(
            {"email": email},
            { "$set": {"description": description} }
        )

        return jsonify({"status":"done", "movies":json_data}), 200

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500
    

def addMovie():
    try:
        data = request.get_json()

        movies = data.get("movies", [])
        if not isinstance(movies, list):
            movies = [movies]

        email =  data.get("email")


        collection.update_one(
            {'email': email}, #find user with this email.
            {"$addToSet": {"movies":{"$each":movies}}}, 
            upsert=True
        )

        return  jsonify({"status": "done"}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500
def get_email_from_token():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return None
    try:
        schema, token = auth_header.split(" ")  # "Bearer <token>"
        if schema != "Bearer":
            return None
        decoded = jwt.decode(token, secret_key, algorithms=["HS256"])
        return decoded["email"]
    except Exception as e:
        print("JWT Error:", e)
        return None


def GetLikedMovies():
    try:
        email = get_email_from_token()
        if not email:
            return jsonify({"error": "Unauthorized"}), 401

        user = collection.find_one({"email": email})
        movies = user.get("movies", [])

        return jsonify({"movies": movies}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500
