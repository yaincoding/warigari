import * as tf from "@tensorflow/tfjs";

const odModelPath =
  "https://raw.githubusercontent.com/yaincoding/warigari/master/src/tf_models/object_detection/model.json";

const classifierModelPath =
  "https://raw.githubusercontent.com/yaincoding/warigari/master/src/tf_models/classifier/model.json";

const loadOdModel = async () => {
  const model = await tf.loadGraphModel(odModelPath);
  return model;
};

const loadClassifier = async () => {
  const model = await tf.loadLayersModel(classifierModelPath);
  for (let i = 0; i < model.layers.length; i++) {
    console.log(i, model.layers[i]);
  }
  return model;
};

const odModelPromise = loadOdModel();
const classifierModelPromise = loadClassifier();

const labelMap = {
  0: "bottom",
  1: "onepiece",
  2: "outwear",
  3: "top",
};

const threshold = 0.5;

const add_img = (img_tensor) => {
  const canvas = document.createElement("canvas");
  canvas.width = img_tensor.shape[1];
  canvas.height = img_tensor.shape[0];
  tf.browser.toPixels(img_tensor, canvas);
  document.getElementById("fashions").appendChild(canvas);
};

const filterBoxes = (boxes, scores) => {
  scores = scores.dataSync().filter((s) => s >= threshold);
  boxes = boxes.dataSync().slice(0, 4 * scores.length);

  const filtered_boxes = [];
  for (let i = 0; i < 4 * scores.length; i += 4) {
    const y_min = boxes[i];
    const x_min = boxes[i + 1];
    const y_max = boxes[i + 2];
    const x_max = boxes[i + 3];
    filtered_boxes.push([y_min, x_min, y_max, x_max]);
  }

  return filtered_boxes;
};

const cropImage = (img_tensor, bboxes, img) => {
  const crops = [];
  for (const bbox of bboxes) {
    const height = parseInt((bbox[2] - bbox[0]) * img.height);
    const width = parseInt((bbox[3] - bbox[1]) * img.width);
    const cropped_img_tensor = tf.image.cropAndResize(
      img_tensor,
      [bbox],
      [0],
      [height, width],
      "bilinear"
    );

    crops.push({ image: cropped_img_tensor, bbox: bbox });
  }
  return crops;
};

export const funcdo = async (img) => {
  const imgTensor = tf.browser.fromPixels(img).expandDims(0);
  add_img(tf.squeeze(imgTensor).resizeBilinear([300, 300]).div(255.0));
  odModelPromise.then((model) => {
    model.executeAsync(imgTensor).then((preds) => {
      const scores = preds[2];
      const boxes = filterBoxes(preds[7], scores);
      const crops = cropImage(imgTensor, boxes, img);
      for (let crop of crops) {
        const cropImgTensor = crop["image"].resizeNearestNeighbor([224, 224]);
        add_img(tf.squeeze(cropImgTensor).div(255.0));
        classifierModelPromise.then((model) => {
          const embedding = tf.sequential({
            layers: [model.layers[0], model.layers[1]],
          });

          const classifier_input = tf.input({ shape: [1, 256] });
          const classifier_output = model.layers[3].apply(
            model.layers[2].apply(classifier_input)
          );

          const classifier = tf.model({
            inputs: classifier_input,
            outputs: classifier_output,
          });

          const embeddingOutput = embedding.predict(cropImgTensor);
          const output = classifier.predict(embeddingOutput.expandDims(0));

          const featureVector = embeddingOutput.dataSync();
          const label = labelMap[tf.argMax(output.dataSync()).dataSync()[0]];

          console.log({ featureVector: featureVector, label: label });
        });
      }
      imgTensor.dispose();
    });
  });
};
