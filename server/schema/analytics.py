from pydantic import BaseModel
from typing import Optional, List, Dict, Literal
from datetime import date

class AnalyticsRequest(BaseModel):
    officeId: str
    startDate: date
    endDate: date

    exchangeType: Optional[Literal["Incoming", "Outgoing"]] = None
    interval: Optional[Literal["Daily", "Weekly", "Monthly"]] = "Monthly"
    products: Optional[List[Literal["Global Volunteer", "Global Talent", "Global Teacher"]]] = None
    aiesecer: Optional[Literal["Yes", "No"]] = None


class PeriodBucket(BaseModel):
    key_as_string: str
    key: int
    doc_count: int

class BucketContainer(BaseModel):
    buckets: List[PeriodBucket]

class AnalyticsData(BaseModel):
    meta: Optional[dict] = None
    doc_count: int
    applications: Optional[BucketContainer] = None
    people: Optional[BucketContainer] = None

class AnalyticsResponse(BaseModel):
    analytics: Dict[str, AnalyticsData]
