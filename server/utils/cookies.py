from fastapi import Response
from typing import Optional

def set_cookie(
    response: Response,
    name: str,
    value: str,
    *,
    max_age: Optional[int] = None,
    secure: bool = False,
):
    response.set_cookie(
        key=name,
        value=value,
        httponly=True,
        secure=secure,
        samesite="strict",
        path="/",
        max_age=max_age,
    )
