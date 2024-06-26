FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3000

ENV MODEL_URL=https://storage.googleapis.com/bucket-mlgc-sub/model-sub/model.json

CMD ["npm", "start"]
