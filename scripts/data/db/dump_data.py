from http import HTTPStatus
import os
import boto3
import pandas as pd
import pymysql
from tqdm import tqdm

# s3에서 데이터 파일 다운로드

s3 = boto3.client(
    service_name='s3',
    region_name='ap-northeast-2',
    aws_access_key_id=os.environ.get('AWS_S3_ACCESS_KEY'),
    aws_secret_access_key=os.environ.get('AWS_S3_SECRET_KEY')
)

bucket_name = 'warigari-fashion-items'
key = 'musinsa.csv'

response = s3.head_bucket(Bucket=bucket_name)

http_status = response['ResponseMetadata']['HTTPStatusCode']
if http_status == HTTPStatus.OK:
    print(f'{bucket_name} 찾았음')

if os.path.isfile(key):
    print(f'{key}가 이미 존재합니다.')
else:
    s3.download_file(bucket_name, key, f'{key}')

# 데이터 읽기
df = pd.read_csv(key, sep=',', names=[
                 'productName', 'productPart', 'imageUrl', 'unitPrice'])

# mysql 연결
mysql_conn = pymysql.connect(host='localhost', user='root',
                             password=os.environ.get('MYSQL_ROOT_PASSWORD'), charset='utf8')
cursor = mysql_conn.cursor()

# db 생성
create_database_sql = 'CREATE DATABASE IF NOT EXISTS `warigari`;'
cursor.execute(create_database_sql)

# db 사용
cursor.execute('USE warigari;')

# table 생성
cursor.execute('DROP TABLE IF EXISTS `Items`;')
create_table_sql = '''
    CREATE TABLE `Items` (
        `itemId` int NOT NULL AUTO_INCREMENT,
        `productName` varchar(255) DEFAULT NULL,
        `productPart` varchar(255) DEFAULT NULL,
        `unitPrice` int NOT NULL DEFAULT 0,
        `imageUrl` text,
        `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`itemId`)
    ) ENGINE=InnoDB AUTO_INCREMENT=45002 DEFAULT CHARSET=utf8mb3;
'''
cursor.execute(create_table_sql)

# 데이터 저장
insert_sql = 'INSERT INTO Items (productName, productPart, imageUrl, unitPrice) VALUES (%s, %s, %s, %s);'
for (_, row) in tqdm(df.iterrows()):
    productName=row['productName']
    productPart=row['productPart']
    imageUrl=row['imageUrl']
    unitPrice=row['unitPrice']
    cursor.execute(insert_sql, (productName, productPart, imageUrl, unitPrice))

mysql_conn.commit()
mysql_conn.close()
