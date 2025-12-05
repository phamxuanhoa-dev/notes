import click
from flask.cli import with_appcontext
from src.db import db
from src.db.models import User, Note, Tag

@click.command("seed")
@with_appcontext
def seed_command():
    """Seeds the database with initial data."""
    print("Seeding the database...")

    # Create admin user
    admin = User(name="Admin User", email="admin@example.com")
    admin.set_password("admin123")
    db.session.add(admin)

    # Create regular users
    user1 = User(name="Test User 1", email="user1@example.com")
    user1.set_password("user123")
    db.session.add(user1)

    user2 = User(name="Test User 2", email="user2@example.com")
    user2.set_password("user123")
    db.session.add(user2)

    # Create sample tags
    tag1 = Tag(name="Work", slug="work")
    tag2 = Tag(name="Personal", slug="personal")
    db.session.add_all([tag1, tag2])

    # Create sample notes
    note1 = Note(title="My first note", content="This is the content of my first note.", owner=admin, tags=[tag1])
    note2 = Note(title="Shopping list", content="Milk, eggs, bread, ...", owner=user1, tags=[tag2])
    db.session.add_all([note1, note2])

    db.session.commit()
    print("Database seeded successfully.")

if __name__ == "__main__":
    # Example usage (for testing purposes)
    from src.app import create_app
    app = create_app()
    with app.app_context():
        seed_command()