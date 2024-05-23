const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeImage(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    const classes = ["Cancer", "Non-cancer"];

    const classResult = confidenceScore >= 50.0 ? 0 : 1;
    const label = classes[classResult];

    let suggestion;

    if (label === "Cancer") {
      suggestion = "Segera periksa ke dokter!";
    } else {
      suggestion =
        "Segera konsultasi dengan dokter terdekat jika ukuran semakin membesar dengan cepat, mudah luka, atau berdarah.";
    }

    console.log("Prediction Scores:", score);
    console.log("Final Classification:", label);

    return { confidenceScore, label, suggestion };
  } catch (error) {
    throw new InputError(`Terjadi kesalahan input: ${error.message}`);
  }
}

module.exports = predictClassification;
