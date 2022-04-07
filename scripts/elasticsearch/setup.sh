git clone https://github.com/deviantony/docker-elk.git $HOME/workspace/docker-elk

cp $HOME/workspace/warigari/scripts/elasticsearch/elasticsearch.yml $HOME/workspace/docker-elk/elasticsearch/config/
cp $HOME/workspace/warigari/scripts/elasticsearch/kibana.yml $HOME/workspace/docker-elk/kibana/config/
cp $HOME/workspace/warigari/scripts/elasticsearch/docker-compose.yml $HOME/workspace/docker-elk/