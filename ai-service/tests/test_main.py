import os
from types import SimpleNamespace

from fastapi.testclient import TestClient

from app import main

client = TestClient(main.app)


def test_health_reports_unconfigured(monkeypatch):
    monkeypatch.setenv("AI_ENABLED", "false")
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    main.get_client.cache_clear()
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["configured"] is False
    assert response.json()["enabled"] is False


def test_summarize_requires_api_key(monkeypatch):
    monkeypatch.setenv("AI_ENABLED", "true")
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    main.get_client.cache_clear()
    response = client.post("/summarize", json={"text": "Nội dung học liệu đủ dài để thực hiện kiểm thử."})
    assert response.status_code == 503


def test_keywords_parses_model_output(monkeypatch):
    monkeypatch.setenv("AI_ENABLED", "true")
    fake_client = SimpleNamespace(
        responses=SimpleNamespace(
            create=lambda **_: SimpleNamespace(output_text="Node.js, REST API, React, MySQL")
        )
    )
    monkeypatch.setattr(main, "get_client", lambda: fake_client)
    response = client.post("/keywords", json={"text": "Tài liệu hướng dẫn xây dựng ứng dụng web full stack."})
    assert response.status_code == 200
    assert response.json()["keywords"] == ["Node.js", "REST API", "React", "MySQL"]
