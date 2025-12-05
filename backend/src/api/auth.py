from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt, get_jwt_identity
from sqlalchemy.exc import IntegrityError

from src.db import db
from src.db.models import User
from src.schemas.schemas import UserRegisterSchema, UserLoginSchema, TokenSchema
from src.core.blocklist import BLOCKLIST

blp = Blueprint("Auth", "auth", description="Operations on authentication")

@blp.route("/api/auth/register")
class UserRegister(MethodView):
    @blp.arguments(UserRegisterSchema)
    @blp.response(201, description="User created successfully.")
    def post(self, user_data):
        """Register a new user"""
        user = User(
            email=user_data["email"],
            name=user_data["name"]
        )
        user.set_password(user_data["password"])

        try:
            db.session.add(user)
            db.session.commit()
        except IntegrityError:
            abort(409, message="An account with this email already exists.")
        
        return {"message": "User created successfully."}

@blp.route("/api/auth/login")
class UserLogin(MethodView):
    @blp.arguments(UserLoginSchema)
    @blp.response(200, TokenSchema)
    def post(self, user_data):
        """Log in a user and return access and refresh tokens"""
        user = User.query.filter_by(email=user_data["email"]).first()

        if user and user.check_password(user_data["password"]):
            access_token = create_access_token(identity=user.id, fresh=True)
            refresh_token = create_refresh_token(identity=user.id)
            return {"access_token": access_token, "refresh_token": refresh_token}
        
        abort(401, message="Invalid credentials.")

@blp.route("/api/auth/refresh")
class TokenRefresh(MethodView):
    @jwt_required(refresh=True)
    @blp.response(200, TokenSchema)
    def post(self):
        """Create a new access token from a refresh token"""
        current_user_id = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user_id, fresh=False)
        return {"access_token": new_access_token}

@blp.route("/api/auth/logout")
class UserLogout(MethodView):
    @jwt_required()
    @blp.response(200, description="Successfully logged out.")
    def post(self):
        """Revoke the current user's access token"""
        jti = get_jwt()["jti"]
        BLOCKLIST.add(jti)
        return {"message": "Successfully logged out."}
