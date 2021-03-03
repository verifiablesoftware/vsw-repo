FROM verifiablesoftware/aries-cloudagent-python:latest

ENV PORT=8062

ENV HTTP_PORT=8060
ENV ADMIN_PORT=8061
ENV WEBHOOK_PORT=8062
ENV EXTERNAL_HOST="3.141.51.96"
ENV WALLET_KEY="Repo.Local"
ENV WALLET_NAME="Repo.Local"
ENV GENESIS_FILE="/home/indy/resources/genesis.txt"

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

# HEALTHCHECK --interval=1m --timeout=3s \
#  CMD curl \
#      --fail \
#      http://localhost:$PORT/adminRoutes/health || \
#      exit 1

CMD node app.js
