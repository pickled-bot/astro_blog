import unittest
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app import create_app
from app.models.post import Post

class CRUDTests(unittest.TestCase):
    
  def setUp(self):
    #set up flask app and test client
    self.app = create_app()
    self.app.config['TESTING'] = True
    self.client = self.app.test_client()

    #set up database
    self.db = SQLAlchemy(self.app)
    self.db.create_all()
  
  def tearDown(self):
    #clean up database
    self.db.session.remove()
    self.db.drop_all()
  
  # #GET all posts
  # def test_get_all_posts(self):
  #   #act
  #   response = self.client.get("/posts")
  #   response_body = response.get_json()

  #   #assert 
  #   assert response.status_code == 200
  #   self.assertEqual(len(response_body), 0)

  #GET post by id
  def test_get_post_by_id(self):
    post = Post(date='Mon, 23 Aug 2021 07:00:00 GMT', title='mercury is gatorade', body='a blog post about planets in gatorade.')
    self.db.session.add(post)
    self.db.session.commit()

    #act
    response = self.client.get(f'/posts/{post.id}')
    self.assertEqual(response.status_code, 200)
    post_data = response.get_json()
    self.assertEqual(post_data['title'], 'mercury is gatorade')
    self.assertEqual(post_data['body'], 'a blog post about planets in gatorade.')
    self.assertEqual(post_data['date'], 'Mon, 23 Aug 2021 07:00:00 GMT')

  #POST post
  def test_create_post(self):
    post_data = {
      "date": "Mon, 23 Aug 2021 07:00:00 GMT",
      "title": "mercury is gatorade",
      "body": "a blog post about planets in gatorade."
    }
    response = self.client.post('/posts', json=post_data)
    self.assertEqual(response.status_code, 201)
    self.assertIn(f'Post {post_data["title"]} successful', response.get_data(as_text=True))
  
  #PUT post
  def test_update_post(self):
    post = Post(date='Mon, 23 Aug 2021 07:00:00 GMT', title='mercury is gatorade', body='a blog post about planets in gatorade.')
    self.db.session.add(post)
    self.db.session.commit()

    updated_data = {
      "date": "Mon, 23 Aug 2021 07:00:00 GMT",
      "title": "mercury is retograde",
      "body": "a blog post about planets in retograde."
    }
    response = self.client.patch(f'/posts/{post.id}', json=updated_data)
    self.assertEqual(response.status_code, 200)
    post_data = response.get_json()
    self.assertEqual(post_data['title'], 'mercury is retograde')
    self.assertEqual(post_data['body'], 'a blog post about planets in retograde.')
    self.assertEqual(post_data['date'], 'Mon, 23 Aug 2021 07:00:00 GMT')

    #retrieve
    response = self.client.get(f'/posts/{post.id}')
    self.assertEqual(response.status_code, 200)
    post_data = response.get_json()
    self.assertEqual(post_data['title'], 'mercury is retograde')
    self.assertEqual(post_data['body'], 'a blog post about planets in retograde.')
    self.assertEqual(post_data['date'], 'Mon, 23 Aug 2021 07:00:00 GMT')

  #DELETE post
  def test_delete_post(self):
    post = Post(date='Mon, 23 Aug 2021 07:00:00 GMT', title='mercury is gatorade', body='a blog post about planets in gatorade.')
    self.db.session.add(post)
    self.db.session.commit()

    #act
    response = self.client.delete(f'/posts/{post.id}')
    self.assertEqual(response.status_code, 200)
    self.assertIn(f'Post {post.title} successfully deleted', response.get_data(as_text=True))

    # #verify
    # deleted_post = Post.query.get(post.id)
    # self.assertIsNone(deleted_post)

if __name__ == '__main__':
  unittest.main()