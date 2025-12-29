from pydantic import BaseModel
from typing import List


class Office(BaseModel):
    id: str
    name: str

class OfficeListResponse(BaseModel):
    offices: List[Office]
