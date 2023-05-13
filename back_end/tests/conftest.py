import pytest
from app import db, create_app

@pytest.fixture(scope='session')
def app():
  app = create_app()
  app.config['TESTING'] = True
  with app.app_context():
    db.create_all()
    yield app
    db.drop_all()

@pytest.fixture(scope='session')
def client(app):
  return app.test_client()

@pytest.fixture(scope='function')
def session(app):
  with app.app_context():
    db.session.begin_nested()
    yield db.session
    db.session.rollback()

def tear_down():
  db.session.remove()
  db.drop_all()

def pytest_sessionfinish(session, exitstatus):
  tear_down()

