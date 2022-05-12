# 1. 프로젝트 소개

이커머스 온라인 쇼핑몰 구축을 쉽게 해주기 위한 스켈레톤 프로젝트

<br>

# 2. 실행 방법

## 1) React app
``` bash
cd ./client
npm install
npm start
```

<br>

# 3. 개발환경 세팅

## 1) warigari

``` bash
git clone https://github.com/yaincoding/warigari.git $HOME/workspace/warigari
```

<br>

## 2) python package 설치

이후 필요한 python script 실행에 필요

``` bash
cd scripts
pip install -r requirements.txt
```

<br>

## 3) db 설치 및 데이터 저장
``` bash
# docker mysql 실행
cd scripts/db
docker-compose up -d --build

# s3에서 초기 데이터 다운로드 및 db에 insert
cd scripts/datadb
python dump_data.py
```

<br>

## 4) elasticsearch 설치 및 색인

### a. 셋업
``` bash
#scripts/elasticsearch/setup.sh 를 실행하거나 아래 명령어 라인들 실행
#warigari를 다른 경로에 clone했다면 해당 $HOME/workspace/warigari/... 부분들 수정

git clone https://github.com/deviantony/docker-elk.git $HOME/workspace/docker-elk

cp $HOME/workspace/warigari/scripts/elasticsearch/config/Dockerfile $HOME/workspace/docker-elk/elasticsearch/
cp $HOME/workspace/warigari/scripts/elasticsearch/config/elasticsearch.yml $HOME/workspace/docker-elk/elasticsearch/config/
cp $HOME/workspace/warigari/scripts/elasticsearch/dictionary/*.txt $HOME/workspace/docker-elk/elasticsearch/config/
cp $HOME/workspace/warigari/scripts/elasticsearch/config/docker-compose.yml $HOME/workspace/docker-elk/
cp $HOME/workspace/warigari/scripts/elasticsearch/config/kibana.yml $HOME/workspace/docker-elk/kibana/config/

mkdir $HOME/workspace/docker-elk/elasticsearch/plugins
cp $HOME/workspace/warigari/scripts/elasticsearch/plugins/hanhinsam-0.1.zip $HOME/workspace/docker-elk/elasticsearch/plugins/
```


### b. Elasticsearch, Kibana 실행
``` bash
cd $HOME/workspace/docker-elk

docker-compose up -d --build
```

실행 후 http://localhost:9200 접속해서 클러스터 정보 정상적으로 뜨면 성공

### c. elasticsearch index 생성 및 데이터 색인
``` bash
# 데이터 중 이미지 object detection, deep mlp 모델 실행에 필요한 c, python 패키지 등이 많아서 로컬이 지저분해질 수 있기에 docker 이미지를 만들어 실행
cd scripts/data/elasticsearch
docker build -t esindex .
docker run --rm -it --network warigari_net esindex

#이후 docker containe에 접속되고 / 경로에 있게 된다.
python index_data.py
```

이후 kibana console (`http://localhost:5601`)에 접속해서 아래 query dsl로 색인된 데이터 확인
``` javascript
POST /fashion/_search
{
    "query": {
      "match_all": {}
    }
}
```
