from fastapi import APIRouter, Request, HTTPException, Depends
from dotenv import load_dotenv
from schema import ServerSettings, AnalyticsRequest, AnalyticsResponse
import httpx

load_dotenv()
settings = ServerSettings()
router = APIRouter()

INTERVAL_MAP = {
    "Monthly": "month",
    "Weekly": "week",
    "Daily": "day"
}

TYPE_MAP = {
    "Incoming": "opportunity",
    "Outgoing": "person"
}

PROGRAMME_MAP = {
    "Global Volunteer": 7,
    "Global Talent": 8,
    "Global Teacher": 9
}

AIESECER_MAP = {
    "Yes": "true",
    "No": "false"
}

@router.get("/analytics", response_model=AnalyticsResponse)
async def get_analytics(
    payload: AnalyticsRequest = Depends(),
    request: Request = None
):
    access_token = request.cookies.get("access_token")

    if not access_token:
        raise HTTPException(status_code=401, detail="Missing access token")

    params = {
        "histogram[office_id]": payload.officeId,
        "start_date": payload.startDate.isoformat(),
        "end_date": payload.endDate.isoformat(),
        "access_token": access_token,
    }

    if payload.interval:
        params["histogram[interval]"] = INTERVAL_MAP.get(
            payload.interval, payload.interval.lower()
        )

    if payload.exchangeType:
        params["histogram[type]"] = TYPE_MAP.get(
            payload.exchangeType, payload.exchangeType.lower()
        )

    if payload.products:
        params["programmes[]"] = [
            PROGRAMME_MAP[product] for product in payload.products if product in PROGRAMME_MAP
        ]
        

    if payload.aiesecer:
        params["histogram[is_aiesecer]"] = AIESECER_MAP.get(
            payload.aiesecer, payload.aiesecer.lower()
        )

    timeout = httpx.Timeout(connect=30.0, read=60.0, write=10.0, pool=30.0)
    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.get(
            str(settings.analytics_base_url),
            params=params
        )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    return response.json()
