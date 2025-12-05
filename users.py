from flask.views import MethodView
from flask_smorest import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity

from src.db import db
from src.db.models import User
from src.schemas.schemas import UserSchema

blp = Blueprint("Users", "users", description="Operations on users")

@blp.route("/api/users/me")
class UserMe(MethodView):
    @jwt_required()
    @blp.response(200, UserSchema)
    def get(self):
        """Get current user's profile"""
        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id)
        return user

    @jwt_required()
    @blp.arguments(UserSchema(only=("name",)))
    @blp.response(200, UserSchema)
    def put(self, user_data):
        """Update current user's profile"""
        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id)
        user.name = user_data.get("name", user.name)
        db.session.commit()
        return user