from datetime import datetime
import os
import elasticsearch
import pymysql
from elasticsearch import Elasticsearch

from PIL import Image
import io
import urllib.request
from image_feature import FashionDetector, FeatureExtractor


# mysql 연결
mysql_conn = pymysql.connect(host='localhost', user='root',
                             password=os.environ.get('MYSQL_ROOT_PASSWORD'), charset='utf8')
cursor = mysql_conn.cursor()

# elasticsearch 연결
es = Elasticsearch(
    hosts='http://localhost:9200'
)

fashion_alias = 'fashion'

def create_index():
    now = datetime.now().strftime('%Y%m%d%H%M%S')
    index_name = f'{fashion_alias}_{now}'

    settings = {
        "number_of_shards": 1,
        "number_of_replicas": 0,
        "analysis": {
            "char_filter": {
                "clean_filter": {
                    "pattern": """[^\p{L}\p{Nd}\p{Blank}]""",
                    "type": "pattern_replace",
                    "replacement": " "
                }
            },
            "tokenizer": {
                "kor_tokenizer": {
                    "type": "nori_tokenizer",
                    "decompound_mode": "discard",
                    "discard_punctuation": "true",
                    "user_dictionary": "user_dictionary.txt"
                }
            }, 
            "filter": {
                "synonym_filter": {
                    "type": "synonym_graph",
                    "synonyms_path": "synonyms.txt"
                }
            }, 
            "analyzer": {
                "index_analyzer": {
                    "type": "custom",
                    "char_filter": [
                        "clean_filter"  
                    ],
                    "tokenizer": "kor_tokenizer",
                    "filter": [
                        "lowercase",
                        "nori_readingform"  
                    ]
                },
                "search_analyzer": {
                    "type": "custom",
                    "char_filter": [
                        "clean_filter"
                    ],
                    "tokenizer": "kor_tokenizer",
                    "filter": [
                        "lowercase",
                        "nori_readingform",
                        "synonym_filter"
                    ]
                }
            }
        }
    }

    mappings = {
        "properties": {
            "id": {
                "type": "integer"
            },
            "productName": {
                "type": "text",
                "analyzer": "index_analyzer",
                "search_analyzer": "search_analyzer"
            },
            "productPart": {
                "type": "keyword"
            },
            "unitPrice": {
                "type": "integer"
            },
            "imageUrl": {
                "type": "keyword"
            },
            "image_vector": {
                "type": "dense_vector",
                "dims": 256
            }
        } 
    }

    result = es.indices.create(index=index_name, settings=settings, mappings=mappings)
    if result['acknowledged']:
        print(f'index {index_name}이 생성되었습니다.')
        return index_name

def update_alias():
    try:
        aliases = es.indices.get_alias(name=fashion_alias)
        if aliases:
            for index in aliases:
                es.indices.delete_alias(index=index, name=fashion_alias)
    except elasticsearch.NotFoundError:
        aliases = None

    es.indices.put_alias(name=fashion_alias, index=index_name) 
    

index_name = create_index()

detector_model_path = "/tf_models/object_detection"
detector = FashionDetector(detector_model_path)
classifier_model_path = "/tf_models/classifier"
feature_extractor = FeatureExtractor(classifier_model_path)

def load_image(image_url):
        res = urllib.request.urlopen(image_url).read()
        img = Image.open(io.BytesIO(res))
        return img
    
def get_vectors(image_url):
    img = load_image(image_url)
    crops = detector.crop(img, min_score=0.6)
    crop_feature_vector = None
    if len(crops) > 0:
        crop_feature_vector = feature_extractor.extract_from_tensor(crops[0]).tolist()
    full_feature_vector = feature_extractor.extract_from_image(img).tolist()

    return {
        'crop_feature_vector': crop_feature_vector,
        'full_feature_vector': full_feature_vector
    }

def index_data():
    cursor.execute('USE warigari;')
    cursor.execute('SELECT itemId, productName, productPart, unitPrice, imageUrl FROM Items;')
    result = cursor.fetchall()
    for row in result:
        itemId, productName, productPart, unitPrice, imageUrl = row
        vectors = get_vectors(imageUrl)
        crop_feature_vector = vectors['crop_feature_vector']
        full_feature_vector = vectors['full_feature_vector']
        print(crop_feature_vector)
        print(full_feature_vector)
        break