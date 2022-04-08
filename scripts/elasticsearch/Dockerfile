ARG ELASTIC_VERSION

# https://www.docker.elastic.co/
FROM docker.elastic.co/elasticsearch/elasticsearch:${ELASTIC_VERSION}

COPY plugins/hanhinsam-0.1.zip /plugins/hanhinsam.zip

RUN elasticsearch-plugin install analysis-nori
RUN elasticsearch-plugin install file:///plugins/hanhinsam.zip