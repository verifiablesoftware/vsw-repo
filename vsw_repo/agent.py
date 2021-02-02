from pathlib import Path

from aries_cloudagent_vsw.commands import run_command

from vsw_repo import utils
from vsw_repo.log import Log

logger = Log(__name__).logger


def provision():
    configuration = utils.get_vsw_repo()
    wallet_name = configuration.get("wallet_name")
    wallet_key = configuration.get("wallet_key")
    config_path = Path(__file__).parent.parent.joinpath("conf/genesis.txt").resolve()
    logger.info('genesis_file: ' + str(config_path))
    run_command('provision', [
        '--endpoint', configuration.get("endpoint"),
        '--seed', configuration.get("seed"),
        '--genesis-file', str(config_path),
        '--accept-taa', '1',
        '--wallet-type', 'indy',
        '--wallet-name', wallet_name,
        '--wallet-key', wallet_key
    ])


def start_agent():
    configuration = utils.get_vsw_repo()
    config_path = Path(__file__).parent.parent.joinpath("conf/genesis.txt").resolve()
    wallet_name = configuration.get("wallet_name")
    wallet_key = configuration.get("wallet_key")
    logger.info('genesis_file: ' + str(config_path))
    run_command('start', ['--admin', configuration.get("admin_host"), configuration.get("admin_port"),
                          '--inbound-transport', configuration.get("inbound_transport_protocol"),
                          configuration.get("inbound_transport_host"), configuration.get("inbound_transport_port"),
                          '--outbound-transport', configuration.get('outbound_transport_protocol'),
                          '--endpoint', configuration.get("endpoint"),
                          '--label', configuration.get("label"),
                          '--seed', configuration.get("seed"),
                          '--genesis-file', str(config_path),
                          '--webhook-url', configuration.get("webhook_url"),
                          '--accept-taa', '1',
                          '--wallet-type', 'indy',
                          '--wallet-name', wallet_name,
                          '--wallet-key', wallet_key,
                          '--public-invites',
                          '--debug',
                          '--auto-accept-invites',
                          '--auto-accept-requests',
                          '--auto-ping-connection',
                          '--auto-respond-messages',
                          '--auto-respond-credential-offer',
                          '--auto-respond-presentation-request',
                          '--auto-verify-presentation',
                          '--admin-insecure-mode'])
