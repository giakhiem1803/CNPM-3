import os
from functools import lru_cache

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from openai import OpenAI
from pydantic import BaseModel, Field

load_dotenv()


class TextRequest(BaseModel):
    text: str = Field(min_length=20, max_length=12000)


@lru_cache
def get_client() -> OpenAI | None:
    if os.getenv("AI_ENABLED", "false").strip().lower() != "true":
        return None
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    return OpenAI(api_key=api_key, timeout=18.0, max_retries=1) if api_key else None


def generate(instructions: str, text: str, max_output_tokens: int = 250) -> str:
    client = get_client()
    if client is None:
        raise HTTPException(
            status_code=503,
            detail="Chức năng AI đang tắt hoặc chưa được cấu hình.",
        )
    try:
        response = client.responses.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
            instructions=instructions,
            input=text,
            max_output_tokens=max_output_tokens,
            store=False,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="Không thể nhận phản hồi từ OpenAI.",
        ) from exc
    output = (response.output_text or "").strip()
    if not output:
        raise HTTPException(status_code=502, detail="OpenAI không trả về nội dung.")
    return output


app = FastAPI(title="KhIm Hub AI Service", version="1.0.0")


@app.get("/health")
def health():
    enabled = os.getenv("AI_ENABLED", "false").strip().lower() == "true"
    return {
        "status": "ok",
        "service": "KhIm Hub AI Service",
        "enabled": enabled,
        "configured": enabled and bool(os.getenv("OPENAI_API_KEY", "").strip()),
    }


@app.post("/summarize")
def summarize(payload: TextRequest):
    summary = generate(
        "Bạn hỗ trợ biên tập học liệu bằng tiếng Việt. Hãy viết một đoạn mô tả "
        "trung lập, rõ ràng, tối đa 80 từ. Không thêm dữ kiện không có trong văn bản.",
        payload.text,
    )
    return {"summary": summary}


@app.post("/keywords")
def keywords(payload: TextRequest):
    raw = generate(
        "Trích xuất 4 đến 8 từ khóa tiếng Việt phù hợp cho học liệu. "
        "Chỉ trả về danh sách phân tách bằng dấu phẩy, không đánh số và không giải thích.",
        payload.text,
        max_output_tokens=120,
    )
    values = [item.strip(" .;-\n\t") for item in raw.split(",") if item.strip()]
    return {"keywords": values[:8]}
