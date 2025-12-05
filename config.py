import os
from datetime import timedelta

class Config:
    """Base configuration."""
    
    # Lấy secret key từ biến môi trường, rất quan trọng cho bảo mật
    SECRET_KEY = os.environ.get('SECRET_KEY', 'a_default_secret_key_for_development')
    
    # Cấu hình SQLAlchemy
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///db.sqlite')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Cấu hình Flask-Smorest (API)
    API_TITLE = "Notes API"
    API_VERSION = "v1"
    OPENAPI_VERSION = "3.0.3"
    OPENAPI_URL_PREFIX = "/"
    OPENAPI_SWAGGER_UI_PATH = "/api/docs"
    OPENAPI_SWAGGER_UI_URL = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
    
    # Cấu hình JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'a_default_jwt_secret_key')
    # Thời gian hết hạn cho access token (ví dụ: 15 phút)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=int(os.environ.get("ACCESS_TOKEN_EXPIRES_MINUTES", 15)))
    # Thời gian hết hạn cho refresh token (ví dụ: 30 ngày)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=int(os.environ.get("REFRESH_TOKEN_EXPIRES_DAYS", 30)))