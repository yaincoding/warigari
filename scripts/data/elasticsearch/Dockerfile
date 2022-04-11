FROM tensorflow/tensorflow

COPY index_data.py /index_data.py
COPY image_feature.py /image_feature.py
COPY /tf_models tf_models

RUN apt-get install -y git protobuf-compiler
RUN pip install pillow elasticsearch pandas pymysql tensorflow pyparsing==2.4.2
RUN pip uninstall -y opencv-python && pip install "opencv-python-headless<4.3"

RUN git clone https://github.com/tensorflow/models.git
WORKDIR	/models/research
RUN	protoc object_detection/protos/*.proto --python_out=. &&\
	cp object_detection/packages/tf2/setup.py . &&\
	python -m pip install .

RUN pip uninstall -y opencv-python && pip install "opencv-python-headless<4.3"