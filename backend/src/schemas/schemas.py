from marshmallow import Schema, fields, validate

class TagSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    slug = fields.Str(dump_only=True)

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    email = fields.Email(required=True)

class UserRegisterSchema(UserSchema):
    password = fields.Str(required=True, load_only=True, validate=validate.Length(min=8))

class UserLoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True)

class TokenSchema(Schema):
    access_token = fields.Str(required=True)
    refresh_token = fields.Str()

class TaskSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    is_done = fields.Bool(required=True)
    order_index = fields.Int()

class NoteSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    content = fields.Str()
    is_private = fields.Bool(default=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    owner = fields.Nested(UserSchema(only=("id", "name")), dump_only=True)
    tags = fields.List(fields.Nested(TagSchema))
    tasks = fields.List(fields.Nested(TaskSchema), dump_only=True)

class NoteUpdateSchema(Schema):
    title = fields.Str()
    content = fields.Str()
    is_private = fields.Bool()
    tags = fields.List(fields.Nested(TagSchema(only=("name",))))

class NoteQueryArgsSchema(Schema):
    q = fields.Str(description="Search query for title and content")
    tag = fields.Str(description="Filter by tag name")
    sort = fields.Str(validate=validate.OneOf(["created_at", "updated_at", "title"]), default="updated_at")
    order = fields.Str(validate=validate.OneOf(["asc", "desc"]), default="desc")
    page = fields.Int(load_default=1)
    per_page = fields.Int(load_default=10)

class ShareNoteSchema(Schema):
    email = fields.Email(required=True)
    role = fields.Str(required=True, validate=validate.OneOf(["viewer", "editor"]))

class SharedNoteSchema(Schema):
    id = fields.Int(dump_only=True)
    note_id = fields.Int(dump_only=True)
    user = fields.Nested(UserSchema(only=("id", "name", "email")), dump_only=True)
    role = fields.Str(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
