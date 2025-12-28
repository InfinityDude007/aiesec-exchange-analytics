from tzlocal import get_localzone
from datetime import datetime

def get_local_timestamp() -> str:
    local_tz = get_localzone()
    now = datetime.now(local_tz)
    return now.strftime("%Y-%m-%d %H:%M:%S %Z")
