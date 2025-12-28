from fastapi import Response
from typing import Optional
from dotenv import load_dotenv
from schema.config import ServerSettings

load_dotenv()
settings = ServerSettings()
is_prod = not settings.debug

def set_cookie(
    response: Response,
    name: str,
    value: str,
    *,
    max_age: Optional[int] = None,
    secure: bool = is_prod,
):
    response.set_cookie(
        key=name,
        value=value,
        httponly=True,
        secure=secure,
        samesite="none" if is_prod else "strict",
        path="/",
        max_age=max_age,
    )
