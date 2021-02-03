FROM verifiablesoftware/aries-cloudagent-python:latest

ENV PORT=8062
EXPOSE $PORT
USER root
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
  apt-get install nodejs -y

COPY package.json ./
COPY package-lock.json ./
COPY ./app/ ./
COPY ./app/resources/.indy_client ./.indy_client

RUN touch logs/agent.logs
RUN npm install && npm cache clean --force

HEALTHCHECK --interval=1m --timeout=3s \
  CMD curl \
      --fail \
      http://localhost:$PORT/adminRoutes/health || \
      exit 1


CMD node app.js
