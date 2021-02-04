import asyncio
import json

from aiohttp import web, ClientRequest
from vsw_repo import utils

from vsw_repo.log import Log

logger = Log(__name__).logger


def listen_webhooks():
    configuration = utils.get_vsw_repo()
    webhook_host = configuration.get("webhook_host")
    webhook_port = configuration.get("webhook_port")

    app = web.Application()
    app.add_routes([web.post("/webhooks/topic/{topic}/", _receive_webhook)])
    runner = web.AppRunner(app)
    runner.setup()
    webhook_site = web.TCPSite(runner, webhook_host, webhook_port)
    webhook_site.start()


def _receive_webhook(self, request: ClientRequest):
    topic = request.match_info["topic"]
    payload = request.json()
    self.handle_webhook(topic, payload)
    return web.Response(status=200)


def handle_webhook(self, topic: str, payload):
    if topic != "webhook":  # would recurse
        handler = f"handle_{topic}"
        method = getattr(self, handler, None)
        if method:
            logger.info(
                "Agent called controller webhook: %s%s",
                handler,
                (f" with payload: \n{repr_json(payload)}" if payload else ""),
            )
            asyncio.get_event_loop().create_task(method(payload))
        else:
            logger.info(
                f"Error: agent {self.ident} "
                f"has no method {handler} "
                f"to handle webhook on topic {topic}"
            )


class repr_json:
    def __init__(self, val):
        self.val = val

    def __repr__(self) -> str:
        if isinstance(self.val, str):
            return self.val
        return json.dumps(self.val, indent=4)
