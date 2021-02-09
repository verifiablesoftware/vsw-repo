from typing import List
from .start import start_agent
from .end import kill


def main(args: List[str]) -> bool:
    kill()
    start_agent()
