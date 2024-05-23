const { Firestore, Timestamp } = require("@google-cloud/firestore");

async function storeData(id, data) {
  const db = new Firestore();

  const predictCollection = db.collection("predictions");
  const documentData = {
    id: id,
    result: data.result,
    suggestion: data.suggestion,
    createdAt: Timestamp.now(),
  };

  try {
    await predictCollection.doc(id).set(documentData);
    console.log("Data stored successfully in Firestore");
  } catch (error) {
    console.error("Error storing data:", error);
    throw new Error("Failed to store data in Firestore");
  }
}

module.exports = storeData;
