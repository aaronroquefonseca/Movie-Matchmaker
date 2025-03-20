from fastapi import APIRouter

router = APIRouter()

@router.get("/items")
def get_items():
    return [{"id": 1, "name": "Item 1"}, {"id": 2, "name": "Item 2"}]
