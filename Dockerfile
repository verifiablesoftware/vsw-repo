FROM verifiablesoftware/aries-cloudagent-python:latest

ENV PORT=8062
EXPOSE $PORT
USER root
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
  apt-get install nodejs -y

COPY package.json ./
COPY package-lock.json ./
COPY ./app/ ./

RUN touch logs/agent.logs
RUN npm i

HEALTHCHECK --interval=1m --timeout=3s \
  CMD curl \
      --fail \
      http://localhost:$PORT/utilsRoutes/health || \
      exit 1

CMD node app.js
