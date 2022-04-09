from datetime import datetime
import os
import pymysql
from elasticsearch import Elasticsearch

# mysql 연결
mysql_conn = pymysql.connect(host='localhost', user='root',
                             password=os.environ.get('MYSQL_ROOT_PASSWORD'), charset='utf8')
cursor = mysql_conn.cursor()

# elasticsearch 연결
es = Elasticsearch(
    hosts='http://localhost:9200'
)

index_name = 'fashion'

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
                "discard_punctuation": true,
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

es.indices.create(index=index_name, settings=settings, mappings=mappings)


cursor.execute('USE warigari;')
cursor.execute('SELECT itemId, productName, productPart, unitPrice, imageUrl FROM Items limit 5;')
result = cursor.fetchall()
for row in result:
    itemId, productName, productPart, unitPrice, imageUrl = row
