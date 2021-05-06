FROM verifiablesoftware/aries-cloudagent-python:latest

ENV PORT=8062
ENV HTTP_PORT=8060
ENV ADMIN_PORT=8061
ENV WEBHOOK_PORT=8062
ENV EXTERNAL_HOST="3.141.51.96"

ENV WALLET_KEY="Repo.Agent"
ENV WALLET_NAME="Repo.Agent"

ENV GENESIS_FILE="/home/indy/resources/genesis.txt"
ENV TAILS_URL="http://vswrepo.com:6543"

EXPOSE $PORT

USER root
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
  apt-get install nodejs -y

COPY ./app/package.json ./
COPY ./app/package-lock.json ./
COPY ./app/ ./
COPY ./app/resources/.indy_client ./.indy_client

RUN touch logs/agent.logs
RUN npm install && npm cache clean --force

CMD node ./bin/www
