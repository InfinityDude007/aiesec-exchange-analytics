from fastapi import APIRouter, Request, HTTPException
from dotenv import load_dotenv
from schema import ServerSettings, Office, OfficeListResponse
import httpx

load_dotenv()
settings = ServerSettings()
router = APIRouter()

@router.get("/office", response_model=OfficeListResponse)
async def search_offices(q: str, request: Request):
    access_token = request.cookies.get("access_token")

    if not access_token:
        raise HTTPException(status_code=401, detail="Missing access token")

    query = """
        query($query: String!) {
            committeeAutocomplete(q: $query) {
                id
                name
                full_name
            }
        }
    """

    async with httpx.AsyncClient() as client:
        response = await client.post(
            str(settings.aiesec_graphql_url),
            json={
                "query": query,
                "variables": {
                    "query": q
                }
            },
            headers={
                "Authorization": access_token,
                "Content-Type": "application/json"
            }
        )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=f"Failed to fetch offices: {response.text}")

    data = response.json()["data"]["committeeAutocomplete"]

    filtered_offices = []
    for office in data:
        office_lower = office["name"].lower()
        if "inactive" not in office_lower and "closed" not in office_lower and "invalid" not in office_lower:
            filtered_offices.append(
                Office(
                    id=office["id"],
                    name=office["name"]
                )
            )

    if not filtered_offices:
        raise HTTPException(status_code=404, detail="No office found.")

    return OfficeListResponse(offices=filtered_offices)
