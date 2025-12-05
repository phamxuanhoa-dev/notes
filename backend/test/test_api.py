import pytest
from flask import Flask
from src.db import db
from src.app import create_app
from src.db.models import User, Note

@pytest.fixture(scope='module')
def test_app():
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "JWT_SECRET_KEY": "test-secret",
    })

    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture()
def client(test_app):
    return test_app.test_client()

@pytest.fixture()
def runner(test_app):
    return test_app.test_cli_runner()

def test_register_user(client):
    """Test user registration."""
    response = client.post('/api/auth/register', json={
        'name': 'Test User',
        'email': 'test@example.com',
        'password': 'password123'
    })
    assert response.status_code == 201
    assert 'User created successfully' in response.json['message']

def test_login_user(client):
    """Test user login."""
    # First, register a user to login with
    client.post('/api/auth/register', json={
        'name': 'Login User',
        'email': 'login@example.com',
        'password': 'password123'
    })
    response = client.post('/api/auth/login', json={
        'email': 'login@example.com',
        'password': 'password123'
    })
    assert response.status_code == 200
    assert 'access_token' in response.json
    assert 'refresh_token' in response.json

def get_auth_headers(client):
    """Helper to get auth headers for tests."""
    client.post('/api/auth/register', json={'name': 'NoteUser', 'email': 'note@user.com', 'password': 'password'})
    login_res = client.post('/api/auth/login', json={'email': 'note@user.com', 'password': 'password'})
    token = login_res.json['access_token']
    return {'Authorization': f'Bearer {token}'}

def test_create_note(client):
    """Test creating a note when authenticated."""
    headers = get_auth_headers(client)
    response = client.post('/api/notes', json={
        'title': 'My First Note',
        'content': 'This is the content.',
        'tags': ['testing', 'api']
    }, headers=headers)
    assert response.status_code == 201
    assert response.json['title'] == 'My First Note'
    assert 'testing' in [tag['name'] for tag in response.json['tags']]

def test_get_notes(client):
    """Test retrieving notes."""
    headers = get_auth_headers(client)
    client.post('/api/notes', json={'title': 'Note 1'}, headers=headers)
    client.post('/api/notes', json={'title': 'Note 2'}, headers=headers)
    
    response = client.get('/api/notes', headers=headers)
    assert response.status_code == 200
    assert len(response.json) >= 2

def test_update_note_permission(client, test_app):
    """Test that a user cannot update another user's note."""
    headers_owner = get_auth_headers(client)
    note_res = client.post('/api/notes', json={'title': 'Owner Note'}, headers=headers_owner)
    note_id = note_res.json['id']

    # Create another user
    client.post('/api/auth/register', json={'name': 'Other', 'email': 'other@user.com', 'password': 'password'})
    login_res_other = client.post('/api/auth/login', json={'email': 'other@user.com', 'password': 'password'})
    token_other = login_res_other.json['access_token']
    headers_other = {'Authorization': f'Bearer {token_other}'}

    # 'Other' user tries to update the note
    update_res = client.put(f'/api/notes/{note_id}', json={'title': 'Updated by other'}, headers=headers_other)
    assert update_res.status_code == 403 # Forbidden

def test_share_note(client):
    """Test sharing a note with another user."""
    headers_owner = get_auth_headers(client)
    note_res = client.post('/api/notes', json={'title': 'Shared Note'}, headers=headers_owner)
    note_id = note_res.json['id']

    # Create user to share with
    client.post('/api/auth/register', json={'name': 'Receiver', 'email': 'receiver@user.com', 'password': 'password'})

    share_res = client.post(f'/api/notes/{note_id}/share', json={
        'email': 'receiver@user.com',
        'role': 'viewer'
    }, headers=headers_owner)
    
    assert share_res.status_code == 201
    assert share_res.json['user']['email'] == 'receiver@user.com'
    assert share_res.json['role'] == 'viewer'
