from flask_jwt_extended import get_jwt_identity
from flask_smorest import abort
from flask_jwt_extended import JWTManager

from src.db.models import Note, SharedNote

jwt = JWTManager()

def check_permission(note_id: int, required_level: str) -> Note:
    """
    Checks if the current user has the required permission level for a note.
    Levels: 'viewer', 'editor', 'owner'.
    - 'owner' can do anything.
    - 'editor' can view and edit.
    - 'viewer' can only view.
    Returns the note object if permission is granted, otherwise aborts.
    """
    user_id = get_jwt_identity()
    note = Note.query.get(note_id)

    if not note:
        abort(404, message=f"Note with ID {note_id} not found.")

    # The owner has all permissions
    if note.owner_id == user_id:
        return note

    # If owner permission is required, but user is not the owner, deny access
    if required_level == "owner":
        abort(403, message="You do not have permission to perform this action.")

    # Check for shared permissions
    share = SharedNote.query.filter_by(note_id=note_id, user_id=user_id).first()
    if not share or (required_level == "editor" and share.role != "editor"):
        abort(403, message="You do not have permission to access this note.")

    return note