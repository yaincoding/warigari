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

index_name = 'musinsa_fashions'

settings = {
    
}

es.indices.create(index=index_name, settings=settings, mappings=mappings)


cursor.execute('USE warigari;')
cursor.execute('SELECT itemId, productName, productPart, unitPrice, imageUrl FROM Items limit 5;')
result = cursor.fetchall()
for row in result:
    itemId, productName, productPart, unitPrice, imageUrl = row
