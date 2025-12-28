from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse, JSONResponse
from dotenv import load_dotenv
from urllib.parse import urlencode, urljoin
import httpx
from schema.config import ServerSettings
from utils.cookies import set_cookie

load_dotenv()
settings = ServerSettings()
router = APIRouter(prefix="/auth")


@router.get("/login")
async def login(request: Request):
    next_path = request.query_params.get("next", "/")
    frontend_url = str(settings.frontend_url)

    if not next_path.startswith("/"):
        next_path = "/"

    redirect_target = urljoin(
        frontend_url.rstrip("/") + "/",
        next_path.lstrip("/")
    )

    response = RedirectResponse(url="/")

    set_cookie(
        response,
        "redirect_uri",
        redirect_target,
        secure=not settings.debug,
    )

    params = {
        "response_type": "code",
        "client_id": settings.auth_client_id,
        "redirect_uri": str(settings.auth_redirect_uri),
        "state": "",
    }

    response.headers["Location"] = (
        f"{settings.gis_auth_endpoint}/oauth/authorize?"
        f"{urlencode(params)}"
    )
    response.status_code = 302

    return response


@router.get("/callback")
async def callback(request: Request):
    code = request.query_params.get("code")
    error = request.query_params.get("error")
    error_desc = request.query_params.get("error_description")

    if error:
        return RedirectResponse(
            f"{settings.frontend_url}/#auth=error&message={error_desc or error}"
        )

    if not code:
        raise HTTPException(status_code=400, detail="Missing authorization code")

    token_payload = {
        "grant_type": "authorization_code",
        "client_id": settings.auth_client_id,
        "client_secret": settings.auth_client_secret,
        "redirect_uri": str(settings.auth_redirect_uri),
        "code": code,
    }

    async with httpx.AsyncClient() as client:
        token_res = await client.post(
            f"{settings.gis_auth_endpoint}/oauth/token",
            data=token_payload,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )

    data = token_res.json()

    if token_res.status_code != 200:
        return RedirectResponse(
            f"{settings.frontend_url}/#auth=error&message={data.get('error')}"
        )

    response = RedirectResponse(
        request.cookies.get("redirect_uri", f"{settings.frontend_url}/")
    )

    if "access_token" in data:
        set_cookie(
            response,
            "access_token",
            data["access_token"],
            max_age=int(data.get("expires_in", 0)),
            secure=not settings.debug,
        )

    if "refresh_token" in data:
        set_cookie(
            response,
            "refresh_token",
            data["refresh_token"],
            secure=not settings.debug,
        )

    response.delete_cookie("redirect_uri", path="/")
    return response


@router.post("/refresh")
async def refresh(request: Request):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token")

    payload = {
        "grant_type": "refresh_token",
        "client_id": settings.auth_client_id,
        "client_secret": settings.auth_client_secret,
        "refresh_token": refresh_token,
    }

    async with httpx.AsyncClient() as client:
        token_res = await client.post(
            f"{settings.gis_auth_endpoint}/oauth/token",
            data=payload,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )

    data = token_res.json()

    if token_res.status_code != 200:
        return JSONResponse(status_code=401, content=data)

    response = JSONResponse({"ok": True})

    if "access_token" in data:
        set_cookie(
            response,
            "access_token",
            data["access_token"],
            max_age=int(data.get("expires_in", 0)),
            secure=not settings.debug,
        )

    if "refresh_token" in data:
        set_cookie(
            response,
            "refresh_token",
            data["refresh_token"],
            secure=not settings.debug,
        )

    return response


@router.post("/logout")
async def logout():
    response = JSONResponse({"ok": True})
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return response


@router.get("/status")
async def status(request: Request):
    return {"loggedIn": bool(request.cookies.get("access_token"))}
