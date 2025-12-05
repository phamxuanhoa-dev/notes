from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_

from src.db import db
from src.db.models import Note, Tag, User, SharedNote, Task
from src.schemas.schemas import (
    NoteSchema,
    NoteUpdateSchema,
    NoteQueryArgsSchema,
    ShareNoteSchema,
    SharedNoteSchema,
    TaskSchema
)
from src.core.auth import check_permission

blp = Blueprint("Notes", "notes", description="Operations on notes")

@blp.route("/api/notes")
class NoteList(MethodView):
    @jwt_required()
    @blp.arguments(NoteQueryArgsSchema, location="query")
    @blp.response(200, NoteSchema(many=True))
    def get(self, args):
        """List all accessible notes for the current user"""
        user_id = get_jwt_identity()
        
        # Base query: notes owned by the user or shared with the user
        query = Note.query.join(User, Note.owner_id == User.id)\
            .outerjoin(SharedNote, Note.id == SharedNote.note_id)\
            .filter(Note.deleted_at.is_(None))\
            .filter(or_(Note.owner_id == user_id, SharedNote.user_id == user_id))

        # Filter by search query (q)
        if "q" in args:
            search_term = f"%{args['q']}%"
            query = query.filter(or_(Note.title.ilike(search_term), Note.content.ilike(search_term)))

        # Filter by tags
        if "tag" in args:
            query = query.join(Note.tags).filter(Tag.name == args["tag"])

        # Sorting
        sort_by = args.get("sort", "updated_at")
        order = args.get("order", "desc")
        if hasattr(Note, sort_by):
            if order == "desc":
                query = query.order_by(getattr(Note, sort_by).desc())
            else:
                query = query.order_by(getattr(Note, sort_by).asc())

        # Pagination
        page = args.get("page", 1)
        per_page = args.get("per_page", 10)
        paginated_notes = query.distinct().paginate(page=page, per_page=per_page, error_out=False)
        
        return paginated_notes.items

    @jwt_required()
    @blp.arguments(NoteSchema(only=("title", "content", "is_private", "tags")))
    @blp.response(201, NoteSchema)
    def post(self, note_data):
        """Create a new note"""
        user_id = get_jwt_identity()
        
        tags = []
        if "tags" in note_data:
            tag_names = [t["name"] for t in note_data["tags"]]
            # Find existing tags or create new ones
            for name in tag_names:
                tag = Tag.query.filter_by(name=name).first()
                if not tag:
                    tag = Tag(name=name, slug=name.lower().replace(" ", "-"))
                    db.session.add(tag)
                tags.append(tag)

        note = Note(
            title=note_data["title"],
            content=note_data.get("content", ""),
            owner_id=user_id,
            is_private=note_data.get("is_private", True),
            tags=tags
        )
        db.session.add(note)
        db.session.commit()
        return note

@blp.route("/api/notes/<int:note_id>")
class NoteDetail(MethodView):
    @jwt_required()
    @blp.response(200, NoteSchema)
    def get(self, note_id):
        """Get a single note by ID"""
        note = check_permission(note_id, "viewer")
        return note

    @jwt_required()
    @blp.arguments(NoteUpdateSchema)
    @blp.response(200, NoteSchema)
    def put(self, note_data, note_id):
        """Update an existing note"""
        note = check_permission(note_id, "editor")
        
        note.title = note_data.get("title", note.title)
        note.content = note_data.get("content", note.content)
        note.is_private = note_data.get("is_private", note.is_private)

        if "tags" in note_data:
            note.tags.clear()
            tag_names = [t["name"] for t in note_data["tags"]]
            for name in tag_names:
                tag = Tag.query.filter_by(name=name).first()
                if not tag:
                    tag = Tag(name=name, slug=name.lower().replace(" ", "-"))
                    db.session.add(tag)
                note.tags.append(tag)

        db.session.commit()
        return note

    @jwt_required()
    @blp.response(204)
    def delete(self, note_id):
        """Delete a note (soft delete)"""
        note = check_permission(note_id, "owner")
        # Soft delete can be implemented here if needed, for now, we do a hard delete
        db.session.delete(note)
        db.session.commit()
        return {}

@blp.route("/api/notes/<int:note_id>/share")
class NoteShare(MethodView):
    @jwt_required()
    @blp.arguments(ShareNoteSchema)
    @blp.response(201, SharedNoteSchema)
    def post(self, share_data, note_id):
        """Share a note with another user"""
        note = check_permission(note_id, "owner")
        owner_id = get_jwt_identity()

        user_to_share_with = User.query.filter_by(email=share_data["email"]).first()
        if not user_to_share_with:
            abort(404, message="User to share with not found.")
        
        if user_to_share_with.id == owner_id:
            abort(400, message="You cannot share a note with yourself.")

        existing_share = SharedNote.query.filter_by(note_id=note_id, user_id=user_to_share_with.id).first()
        if existing_share:
            abort(409, message="Note is already shared with this user.")

        share = SharedNote(
            note_id=note_id,
            user_id=user_to_share_with.id,
            role=share_data["role"],
            invited_by=owner_id
        )
        db.session.add(share)
        db.session.commit()
        return share
