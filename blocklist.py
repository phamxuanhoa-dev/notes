"""
This file contains the blocklist of JWT tokens. It is used for token revocation.
For a production application, you should store this in a persistent database like Redis.
"""
BLOCKLIST = set()