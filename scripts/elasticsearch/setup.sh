git clone https://github.com/deviantony/docker-elk.git $HOME/workspace/docker-elk

cp $HOME/workspace/warigari/scripts/elasticsearch/config/Dockerfile $HOME/workspace/docker-elk/elasticsearch/
cp $HOME/workspace/warigari/scripts/elasticsearch/config/elasticsearch.yml $HOME/workspace/docker-elk/elasticsearch/config/
cp $HOME/workspace/warigari/scripts/elasticsearch/config/kibana.yml $HOME/workspace/docker-elk/kibana/config/
cp $HOME/workspace/warigari/scripts/elasticsearch/config/docker-compose.yml $HOME/workspace/docker-elk/
cp $HOME/workspace/warigari/scripts/elasticsearch/dictionary/*.txt $HOME/workspace/docker-elk/elasticsearch/config/

mkdir $HOME/workspace/docker-elk/elasticsearch/plugins
cp $HOME/workspace/warigari/scripts/elasticsearch/plugins/hanhinsam-0.1.zip $HOME/workspace/docker-elk/elasticsearch/plugins/