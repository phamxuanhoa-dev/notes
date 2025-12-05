from datetime import datetime
from sqlalchemy.sql import func
from . import db
import bcrypt

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())
    notes = db.relationship('Note', back_populates='owner', lazy='dynamic')
    shared_notes = db.relationship('SharedNote', back_populates='user')

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

class Note(db.Model):
    __tablename__ = 'notes'
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=True)
    is_private = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())
    deleted_at = db.Column(db.DateTime(timezone=True), nullable=True)
    
    owner = db.relationship('User', back_populates='notes')
    tasks = db.relationship('Task', back_populates='note', cascade="all, delete-orphan")
    tags = db.relationship('Tag', secondary='note_tags', back_populates='notes')
    shares = db.relationship('SharedNote', back_populates='note', cascade="all, delete-orphan")

class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    note_id = db.Column(db.Integer, db.ForeignKey('notes.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    is_done = db.Column(db.Boolean, default=False, nullable=False)
    order_index = db.Column(db.Integer, default=0)
    note = db.relationship('Note', back_populates='tasks')

class Tag(db.Model):
    __tablename__ = 'tags'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    slug = db.Column(db.String(50), unique=True, nullable=False)
    notes = db.relationship('Note', secondary='note_tags', back_populates='tags')

note_tags = db.Table('note_tags',
    db.Column('note_id', db.Integer, db.ForeignKey('notes.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'), primary_key=True)
)

class SharedNote(db.Model):
    __tablename__ = 'shared_notes'
    id = db.Column(db.Integer, primary_key=True)
    note_id = db.Column(db.Integer, db.ForeignKey('notes.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='viewer') # 'viewer' or 'editor'
    invited_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    accepted = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    
    note = db.relationship('Note', back_populates='shares')
    user = db.relationship('User', back_populates='shared_notes', foreign_keys=[user_id])
    inviter = db.relationship('User', foreign_keys=[invited_by])
