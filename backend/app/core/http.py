"""Safe errors and structured access events without request payloads."""
import json
import logging
from time import perf_counter
from uuid import uuid4

from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.types import ASGIApp, Receive, Scope, Send

access_logger = logging.getLogger("traderath.access")


def error_response(request: Request, status: int, code: str, message: str,
                   headers: dict | None = None) -> JSONResponse:
    return JSONResponse(status_code=status, headers=headers, content={"error": {
        "code": code, "message": message,
        "request_id": request.scope["state"]["request_id"],
    }})


class RequestContextMiddleware:
    def __init__(self, app: ASGIApp):
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        if scope["type"] != "http":
            return await self.app(scope, receive, send)
        request_id = uuid4().hex
        scope.setdefault("state", {})["request_id"] = request_id
        started = perf_counter()
        status = 500
        response_started = False

        async def send_response(message):
            nonlocal status, response_started
            if message["type"] == "http.response.start":
                response_started = True
                status = message["status"]
                headers = [(k, v) for k, v in message.get("headers", []) if k.lower() != b"x-request-id"]
                message = {**message, "headers": headers + [(b"x-request-id", request_id.encode("ascii"))]}
            await send(message)

        try:
            await self.app(scope, receive, send_response)
        except Exception:
            if response_started:
                raise
            response = error_response(Request(scope), 500, "INTERNAL_ERROR", "An unexpected error occurred.")
            await response(scope, receive, send_response)
        finally:
            route = scope.get("route")
            access_logger.info(json.dumps({
                "event": "http_request", "request_id": request_id,
                "method": scope["method"], "route": getattr(route, "path", "unmatched"),
                "status": status, "duration_ms": round((perf_counter() - started) * 1000, 2),
            }))
