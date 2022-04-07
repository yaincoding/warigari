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
## 2) db
```

```

<br>
## 3) elasticsearch

### a. 셋업
``` bash
#scripts/elasticsearch/setup.sh 를 실행하거나 아래 명령어 라인들 실행

git clone https://github.com/deviantony/docker-elk.git $HOME/workspace/docker-elk

cp $HOME/workspace/warigari/scripts/elasticsearch/elasticsearch.yml $HOME/workspace/docker-elk/elasticsearch/config/
cp $HOME/workspace/warigari/scripts/elasticsearch/kibana.yml $HOME/workspace/docker-elk/kibana/config/
cp $HOME/workspace/warigari/scripts/elasticsearch/docker-compose.yml $HOME/workspace/docker-elk/
```

### b. 실행
``` bash
cd $HOME/workspace/docker-elk

docker-compose up -d --build
```

### c. 데이터 색인
```
# MySQL -> Elasticsearch 데이터 색인 python 스크립트 실행
# 혹은 MySQL -> Elasticsearch 일괄 색인하는 express api 호출
```
