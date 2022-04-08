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

## 2) db 설치 및 데이터 저장
```
# 먼저 MySQL이 실행되어야한다.

cd $HOME/workspace/warigari/scripts/db

pip install -r requirements.txt

# python 3버전
python dump_data.py
```

<br>

## 3) elasticsearch 설치 및 색인

### a. 셋업
``` bash
#scripts/elasticsearch/setup.sh 를 실행하거나 아래 명령어 라인들 실행
#warigari를 다른 경로에 clone했다면 해당 $HOME/workspace/warigari/... 부분들 수정

git clone https://github.com/deviantony/docker-elk.git $HOME/workspace/docker-elk

cp $HOME/workspace/warigari/scripts/elasticsearch/Dockerfile $HOME/workspace/docker-elk/elasticsearch/
cp $HOME/workspace/warigari/scripts/elasticsearch/elasticsearch.yml $HOME/workspace/docker-elk/elasticsearch/config/
cp $HOME/workspace/warigari/scripts/elasticsearch/dictionary/*.txt $HOME/workspace/docker-elk/elasticsearch/config/
cp $HOME/workspace/warigari/scripts/elasticsearch/kibana.yml $HOME/workspace/docker-elk/kibana/config/
cp $HOME/workspace/warigari/scripts/elasticsearch/docker-compose.yml $HOME/workspace/docker-elk/

mkdir $HOME/workspace/docker-elk/elasticsearch/plugins
cp $HOME/workspace/warigari/scripts/elasticsearch/plugins/hanhinsam-0.1.zip $HOME/workspace/docker-elk/elasticsearch/plugins/
```


### b. 실행
``` bash
cd $HOME/workspace/docker-elk

docker-compose up -d --build
```

실행 후 http://localhost:9200 접속해서 클러스터 정보 정상적으로 뜨면 성공

### c. 데이터 색인
```
# MySQL -> Elasticsearch 데이터 색인 python 스크립트 실행
# 혹은 MySQL -> Elasticsearch 일괄 색인하는 express api 호출
```
