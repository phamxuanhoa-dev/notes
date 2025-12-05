from flask.views import MethodView
from flask_smorest import Blueprint
from flask_jwt_extended import jwt_required

from src.db.models import Tag
from src.schemas.schemas import TagSchema

blp = Blueprint("Tags", "tags", description="Operations on tags")

@blp.route("/api/tags")
class TagList(MethodView):
    @jwt_required()
    @blp.response(200, TagSchema(many=True))
    def get(self):
        """Get a list of all tags"""
        return Tag.query.all()