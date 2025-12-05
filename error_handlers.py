from flask import jsonify
from werkzeug.exceptions import HTTPException

def register_error_handlers(app):
    """Đăng ký các trình xử lý lỗi cho ứng dụng."""

    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        """Trả về phản hồi JSON cho các lỗi HTTP."""
        response = e.get_response()
        response.data = jsonify({
            "success": False,
            "error": {
                "code": e.code,
                "name": e.name,
                "message": e.description,
            }
        }).data
        response.content_type = "application/json"
        return response

    @app.errorhandler(Exception)
    def handle_generic_exception(e):
        """Xử lý các lỗi không mong muốn (lỗi 500)."""
        # Ghi log lỗi ở đây trong môi trường production
        app.logger.error(f"Unhandled exception: {e}", exc_info=True)
        return jsonify({"success": False, "error": {"code": 500, "message": "An unexpected internal server error occurred."}}), 500