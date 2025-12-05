import os
from flask import Flask, jsonify
from flask_smorest import Api
from flask_migrate import Migrate
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv

from src.db import db
from src.core.blocklist import BLOCKLIST
from src.core.auth import jwt
from src.core.error_handlers import register_error_handlers

# Import Blueprints
from src.api.auth import blp as AuthBlueprint
from src.api.users import blp as UserBlueprint
from src.api.notes import blp as NoteBlueprint
from src.api.tags import blp as TagBlueprint

def create_app(db_url=None):
    """
    Application Factory Pattern
    """
    app = Flask(__name__)
    load_dotenv()

    # --- Cấu hình ---
    app.config.from_object("src.config.Config")
    app.config["API_SPEC_OPTIONS"] = {
        "security": [{"bearerAuth": []}],
        "components": {
            "securitySchemes": {
                "bearerAuth": {
                    "type": "http",
                    "scheme": "bearer",
                    "bearerFormat": "JWT",
                }
            }
        },
    }

    # --- Khởi tạo Extensions ---
    db.init_app(app)
    migrate = Migrate(app, db)
    api = Api(app)
    jwt.init_app(app)
    
    # Cấu hình CORS
    cors_origins = os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(",")
    CORS(app, resources={r"/api/*": {"origins": cors_origins}}, supports_credentials=True)

    # Cấu hình Rate Limiter
    limiter = Limiter(
        get_remote_address,
        app=app,
        default_limits=["200 per day", "50 per hour"]
    )

    # --- JWT Configuration ---
    @jwt.token_in_blocklist_loader
    def check_if_token_in_blocklist(jwt_header, jwt_payload):
        return jwt_payload["jti"] in BLOCKLIST

    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        return jsonify({"message": "The token has been revoked.", "error": "token_revoked"}), 401

    # --- Đăng ký Blueprints ---
    api.register_blueprint(AuthBlueprint)
    api.register_blueprint(UserBlueprint)
    api.register_blueprint(NoteBlueprint)
    api.register_blueprint(TagBlueprint)

    # --- Đăng ký Error Handlers ---
    register_error_handlers(app)

    # --- Health Check Endpoint ---
    @app.route("/api/health")
    def health_check():
        return jsonify({"status": "ok"}), 200

    # --- Đăng ký CLI commands ---
    from src.db import seed
    app.cli.add_command(seed.seed_command)

    return app
