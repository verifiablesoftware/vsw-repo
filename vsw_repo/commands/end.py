import os
from vsw_repo.utils import get_vsw_repo
from typing import List

from vsw_repo.log import Log

logger = Log(__name__).logger


def main(args: List[str]) -> bool:
    kill()


def kill():
    configuration = get_vsw_repo()
    os.system(f'kill $(lsof -t -i:{configuration.get("admin_port")})')