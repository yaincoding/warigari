import numpy as np
import tensorflow as tf


class FashionDetector:
    def __init__(self, model_path):
        self.detect_fn = tf.saved_model.load(model_path)  # from saved model

    def filter_scores(self, scores, min_score):
        pass_scores = []
        for s in scores:
            if s < min_score:
                break
            pass_scores.append(s)
            break  # 최대 crop 수 1개
        return pass_scores

    def crop(self, image, min_score):
        image_np = np.array(image)
        W, H = image.size
        input_tensor = tf.convert_to_tensor(
            np.expand_dims(image_np, 0), dtype=tf.uint8)
        if len(input_tensor.shape) != 4 or input_tensor.shape[3] != 3:
            return []
        detections = self.detect_fn(input_tensor)

        scores = detections["detection_scores"][0].numpy()

        scores = self.filter_scores(scores, min_score)
        if len(scores) < 1:
            return []
        classes = detections["detection_classes"][0].numpy()[:len(scores)]
        boxes = detections["detection_boxes"][0].numpy()[:len(scores)]

        crops = []
        for bbox in boxes:
            height = int((bbox[2] - bbox[0]) * H)
            width = int((bbox[3] - bbox[1]) * W)
            bbox = bbox[0], bbox[1], bbox[2], bbox[3]
            crop = tf.image.crop_and_resize(
                input_tensor,
                [bbox],
                [0],
                [height, width],
                "bilinear"
            )
            crops.append(crop)

        return crops


class FeatureExtractor:
    def __init__(self, model_path):
        self.model = tf.keras.models.load_model(model_path)
        self.IMG_SIZE = 224

    def preprocess_image_tensor(self, image):
        image = tf.image.resize(image, (self.IMG_SIZE, self.IMG_SIZE))
        image = image / 255.0
        return image

    def preprocess_image(self, image):
        image = np.array(image)
        image = np.expand_dims(image, axis=0)
        image = tf.convert_to_tensor(image, dtype=tf.float32)
        image = tf.image.resize(image, (self.IMG_SIZE, self.IMG_SIZE))
        image = image / 255.0
        return image

    def extract_from_tensor(self, image):
        image = self.preprocess_image_tensor(image)
        if len(image.shape) != 4 or image.shape[3] != 3:
            return None

        embedding_layer = self.model.layers[0]
        embedding_output = embedding_layer.predict(image)

        return embedding_output

    def extract_from_image(self, image):
        image = self.preprocess_image(image)
        if len(image.shape) != 4 or image.shape[3] != 3:
            return None

        embedding_layer = self.model.layers[0]
        embedding_output = embedding_layer.predict(image)

        return embedding_output
