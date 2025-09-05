from flask import Blueprint, request, jsonify, make_response, g, Response
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
import pandas as pd
import numpy as np
import ast
import faiss
from sklearn.cluster import MiniBatchKMeans

"""
the ode prepares your data set for fast 
similarity search: 
-convert stored embeddings into real NumPy arrays
-Stack all embeddings together into 2D arrayfor clustering.
-use Kmeans to group movies into n_clusters clusters.
-for each cluster, build FAISS index
-Store all AISS indexes in a dictionary whaere the key is cluster id

"""

df = pd.read_csv('./movies_cleaned.csv', dtype={'vote_count': str})




# convert the embedding from a string to an array.
df['embedding'] = df['embedding'].apply(ast.literal_eval).apply(np.array)
emb_matrix = np.vstack(df['embedding'].to_numpy())



#Train KMeans
n_clusters = 50
kmeans = MiniBatchKMeans(n_clusters=n_clusters, batch_size=1000, random_state=42)
df['cluster'] = kmeans.fit_predict(emb_matrix)


# Build FAISS indexes for each cluster
cluster_indexes = {}# dict to hold FAISS indexes
for cluster_id in range(n_clusters):
   

    df['embedding'] = df['embedding'].apply(lambda x: x.astype('float32') if isinstance(x, np.ndarray) else np.array(x, dtype='float32'))

    #filter df to select the rows belonging to th ecurrent cluster_id
    cluster_data = df[df['cluster'] == cluster_id]["embedding"].to_numpy()
    
    
    if len(cluster_data) == 0:
        continue

    #Extract Embedding column values and convert them to a Numpy array.
    #Stacks the embeddings vertically into 2D array
    cluster_embeddings = np.vstack(cluster_data).astype('float32')
    
    #skip empty clusters
   

    #Get embedding dimension
    dim = cluster_embeddings.shape[1]
    # create an index L2 distance for similarity search.
    index = faiss.IndexFlatL2(dim)
    index.add(cluster_embeddings)#Populte index with current clusters
    cluster_indexes[cluster_id] = index#maps cluster id to its corresponding FAISS index



# Expose objects so Flask can use them

__all__ = ["df", "kmeans" , "cluster_indexes"]