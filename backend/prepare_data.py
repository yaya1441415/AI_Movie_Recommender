import pandas as pd
import requests
from concurrent.futures import ThreadPoolExecutor
import ast
from sentence_transformers import SentenceTransformer

#load a model
model = SentenceTransformer('all-MiniLM-L6-v2')


#read the dataset
df = pd.read_csv('movies.csv', dtype={'vote_count': str})

#Get rid of unwanted columns
df = df.drop(
    ['adult', 'belongs_to_collection', 'budget', 'homepage','original_language', 'original_title','poster_path','production_companies','production_countries','release_date','revenue','spoken_languages','status', 'video'],
    axis=1
)

#convert string representation of list of dictionaries into actual python lists.
def parse_genres(x):
    if pd.isna(x) or x =='[]':
        return []
    try:
        #convert the string x into a Python object
        return ast.literal_eval(x)
    except:
        return []
    

#applye the function to every row in genre column
df["genre_parsed"] = df['genres'].apply(parse_genres)

df['genre_names'] = df['genre_parsed'].apply(lambda lst: ', '.join([d['name'] for d in lst if 'name' in d]))

df["description"] = df["genre_names"]+ ", " + df["overview"] + ", "+ df["tagline"]



df = df.drop(
    ["genre_parsed", "genres", "overview", 'popularity', "tagline", "id","vote_average", "vote_count", "genre_names" ],
    axis=1
)

#change the order of the columns
new_order = ["imdb_id", "title", "description", "runtime"]
df = df[new_order]

df['description'] = df['description'].fillna("")

#get The embeddings of each description.
dsecriptions = df['description'].tolist()
embeddings = model.encode(dsecriptions, batch_size=32,show_progress_bar = True)
df["embedding"] = embeddings.tolist()





# df["embedding"] = df['description'].apply(lambda x: model.encode(x))

#save the new dataset.
df.to_csv('movies_cleaned.csv', index=False)



