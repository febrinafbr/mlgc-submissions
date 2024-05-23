const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const storeData = require("../services/storeData");

async function predictHandler(request, h) {
  try {
    const { image } = request.payload;

    const maxBytes = request.route.settings.payload.maxBytes;
    if (!image || image.bytes > maxBytes) {
      return h
        .response({
          status: "fail",
          message: `Payload content length greater than maximum allowed: ${maxBytes}`,
        })
        .code(413);
    }

    const { model } = request.server.app;

    const { confidenceScore, label, suggestion } = await predictClassification(
      model,
      image
    );
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id,
      result: label,
      suggestion,
      createdAt,
    };

    await storeData(id, data);

    return h
      .response({
        status: "success",
        message: "Model is predicted successfully",
        data,
      })
      .code(201);
  } catch (error) {
    console.error("Prediction error:", error);
    return h
      .response({
        status: "fail",
        message: "Terjadi kesalahan dalam melakukan prediksi",
      })
      .code(400);
  }
}

module.exports = predictHandler;
