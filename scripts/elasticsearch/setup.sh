git clone https://github.com/deviantony/docker-elk.git $HOME/workspace/docker-elk

cp $HOME/workspace/warigari/scripts/elasticsearch/Dockerfile $HOME/workspace/docker-elk/elasticsearch/
cp $HOME/workspace/warigari/scripts/elasticsearch/elasticsearch.yml $HOME/workspace/docker-elk/elasticsearch/config/
cp $HOME/workspace/warigari/scripts/elasticsearch/kibana.yml $HOME/workspace/docker-elk/kibana/config/
cp $HOME/workspace/warigari/scripts/elasticsearch/docker-compose.yml $HOME/workspace/docker-elk/

mkdir $HOME/workspace/docker-elk/elasticsearch/plugins
cp $HOME/workspace/warigari/scripts/elasticsearch/plugins/hanhinsam-0.1.zip $HOME/workspace/docker-elk/elasticsearch/plugins/