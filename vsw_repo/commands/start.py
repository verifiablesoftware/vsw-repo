import asyncio
import configparser
import multiprocessing
import os
import sys
import uuid
import daemon
from vsw_repo.controller import webhook
from os.path import expanduser
from pathlib import Path
from typing import List
from vsw_repo.controller import server

from aries_cloudagent_vsw.commands import run_command

from vsw_repo import utils
from vsw_repo.log import Log

logger = Log(__name__).logger

def main(args: List[str]) -> bool:
    p1 = multiprocessing.Process(name='p1', target=server.start())
    p1.start()
    # p = multiprocessing.Process(name='p', target=webhook.listen_webhooks())

    # p.start()

    start_agent()


def start_agent():
    configuration = utils.get_vsw_repo()

    with daemon.DaemonContext(stdout=sys.stdout, stderr=sys.stderr):
        wallet_name = configuration.get("wallet_name")
        wallet_key = configuration.get("wallet_key")
        config_path = Path(__file__).parent.parent.joinpath("conf/genesis.txt").resolve()
        logger.info('genesis_file: ' + str(config_path))
        run_command('start', ['--admin', configuration.get("admin_host"), configuration.get("admin_port"),
                      '--inbound-transport', configuration.get("inbound_transport_protocol"),
                      configuration.get("inbound_transport_host"), configuration.get("inbound_transport_port"),
                      '--outbound-transport', configuration.get('outbound_transport_protocol'),
                      '--endpoint', configuration.get("endpoint"),
                      '--label', configuration.get("label"),
                      '--seed', get_seed(wallet_name),
                      '--genesis-file', str(config_path),
                      '--webhook-url', configuration.get("webhook_url"),
                      '--accept-taa', '1',
                      '--wallet-type', 'indy',
                      '--wallet-name', wallet_name,
                      '--wallet-key', wallet_key,
                      '--public-invites',
                      '--debug',
                      '--log-config', logger.aries_config_path,
                      '--log-file', logger.aries_log_file,
                      '--debug-credentials',
                      '--auto-accept-invites',
                      '--auto-accept-requests',
                      '--auto-ping-connection',
                      '--auto-respond-messages',
                      '--auto-respond-credential-proposal',
                      '--auto-respond-credential-offer',
                      '--auto-respond-credential-request',
                      '--auto-store-credential',
                      '--auto-respond-presentation-request',
                      '--auto-verify-presentation',
                      '--admin-insecure-mode'])



def get_seed(wallet_name):
    key_folder = expanduser("~") + '/.indy_client/wallet'
    key_path = key_folder + '/key.ini'
    is_exist = os.path.exists(key_path)

    seed=None
    if is_exist:
        config = configparser.ConfigParser()
        config.read(key_path)
        try:
            seed = config[wallet_name]['key']
        except:
            print('not found seed')
    else:
        if os.path.exists(key_folder) is False:
            os.makedirs(key_folder)
    if seed is None:
        seed = uuid.uuid4().hex
        config = configparser.ConfigParser()
        if not config.has_section(wallet_name):
            config.add_section(wallet_name)
        config.set(wallet_name, "key", seed)
        with open(key_path, 'a') as configfile:
            config.write(configfile)

    print('seed:' +seed)
    return seed
