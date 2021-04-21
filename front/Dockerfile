FROM node
COPY . /app
WORKDIR /app
RUN npm run build && npm install -g serve
ENTRYPOINT  serve -s build

