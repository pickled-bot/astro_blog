from app.models.post import Post
from app import create_app, db
import pytest
from conftest import app, client, session, tear_down

@pytest.fixture
def app():
  app = create_app('test')
  app.config['TESTING'] = True
  with app.app_context():
    db.create_all()
    yield app
    db.drop_all()


@pytest.fixture
def client(app):
  with app.test_client() as client:
    with app.app_context():
      db.session.begin_nested()
      yield client
      db.session.rollback()


@pytest.fixture
def one_post(app):
  with app.app_context():
    post = Post(
      date = "Wed, 01 Jan 2020 00:00:00 GMT",
      title = "mercury is gatorade",
      body = "about planets in gatorade"
    )
    db.session.add(post)
    db.session.commit()
    yield
    db.session.delete(post)
    db.session.commit()


@pytest.fixture
def tear_down(autouse=True):
  db.session.remove()
  db.drop_all()

@pytest.mark.usefixtures("client")
def test_get_posts_no_saved_posts(client):
  #act
  response = client.get("/posts")
  response_body = response.get_json()

  #assert
  assert response.status_code == 200
  assert response_body == []

@pytest.mark.usefixtures("client", "one_post")
def test_get_posts_one_saved_post(client, one_post):
  #act
  response = client.get("/posts")
  response_body = response.get_json()

  #assert
  assert response.status_code == 200
  assert len(response_body) == 1
  assert response_body == [{
    "post_id": 1,
    "date": "Wed, 01 Jan 2020 00:00:00 GMT",
    "title": "mercury is gatorade",
    "body": "about planets in gatorade"
  }]

@pytest.mark.usefixtures("client")
def test_create_post(client, one_post):
  #act
  response = client.post('/posts', json={
    "title": "mercury is gatorade",
    "body": "about planets in gatorade"
  })
  response_body = response.get_json()
  #assert
  assert response.status_code == 201
  assert "post" in response_body
  new_post = Post.query.first()
  assert new_post
  assert response_body == f"post {new_post.title} successful"
  assert new_post.title == "mercury is gatorade"
  assert new_post.body == "a blog post about planets in gatorade."

@pytest.mark.usefixtures("client", "one_post")
def test_get_post_by_id(client, one_post):
  #act
  response = client.get("/posts/1")
  response_body = response.get_json()

  assert response.status_code == 200
  assert "post" in response_body
  assert response_body == {
  "post": {
    "post_id": 1,
    "date": "Wed, 01 Jan 2020 00:00:00 GMT",
    "title": "mercury is gatorade",
    "body": "about planets in gatorade"
    }
  }

@pytest.mark.usefixtures("client", "one_post")
def test_delete_post_by_id(client):
  #act
  response = client.delete("/posts/1")
  response_body = response.get_json()

  #assert
  assert response.status_code == 200
  assert "message" in response_body
  assert response_body["message"] == f'post 1 "mercury is gatorade" successfully deleted'

@pytest.mark.usefixtures("client")
def test_get_board_not_found(client):
  #act
  response = client.get("/posts/1")
  response_body = response.get_json()

  #assert
  assert response.status_code == 404
  assert "message" in response_body
  assert response_body["message"] == "post 1 not found"

@pytest.mark.usefixtures("client")
def test_get_board_bad_data(client):
  #act
  response = client.get("/posts/one")
  response_body = response.get_json()

  #assert
  assert response.status_code == 400
  assert "message" in response_body
  assert response_body["message"] == "post one invalid"

def pytest_sessionfinish(session, exitstatus):
  tear_down()
