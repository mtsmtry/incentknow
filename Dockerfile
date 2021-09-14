# FROM node:16-alpine3.13
FROM node:14-alpine3.13

# キャッシュが効くように最初に依存関係をインストール
RUN apk add python3
RUN apk add alpine-sdk

# npm installにキャッシュが効き、なおかつnode_modules以外はキャッシュが効かないように
# 最初にtmpにpackage.jsonだけをコピーする
COPY /backend/package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /code/backend
RUN move /tmp/node_modules /code/backend/

# ソースコードコピー
COPY ./ /code
WORKDIR /code/backend/

# コンパイル
RUN npm run build

# 実行
EXPOSE 8081
ENTRYPOINT [ "npm", "run", "start" ]
