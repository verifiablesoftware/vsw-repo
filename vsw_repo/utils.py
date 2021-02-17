from configparser import RawConfigParser
from pathlib import Path
from typing import Union

from vsw_repo.log import Log

logger = Log(__name__).logger


class ConfigReader:

    def __init__(self, file_path: Union[str, Path]):
        self.configparser = RawConfigParser()
        self.configparser.read(file_path)

    def to_dict(self, section: str = None):
        if section is None:
            configs = {}
            for sec in self.configparser.sections():
                configs[sec] = dict(self.configparser.items(sec))
            return configs
        else:
            configs = self.configparser.items(section)
            return dict(configs)

def get_vsw_repo():
    config_path = Path(__file__).parent.joinpath("conf/vsw.ini").resolve()
    logger.info(config_path)
    config_reader = ConfigReader(config_path)
    config_dict = config_reader.to_dict('vsw-repo')
    logger.info(config_dict)
    return config_dict