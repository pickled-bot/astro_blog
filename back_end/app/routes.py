from flask import Blueprint, request, jsonify, make_response, abort
from app import db
from .models.post import Post


blogs_bp = Blueprint("blogs_bp", __name__, url_prefix="/posts")

@blogs_bp.route("", methods = ["POST"])
def handle_posts():
  request_body = request.get_json()
  new_post = Post(
    date = request_body["date"],
    title = request_body["title"],
    body = request_body["body"]
  )

  db.session.add(new_post)
  db.session.commit()

  return make_response(jsonify(f'Post {new_post.title} successful'), 201)

@blogs_bp.route("", methods=["GET"])
def manage_posts():
  posts = Post.query.all()
  title_query = request.args.get("title")

  if title_query:
    posts = Post.query.filter_by(title=title_query)
  else:
    posts = Post.query.all()
  
  posts_response = [post.to_dictionart() for post in posts]

  return jsonify(posts_response)


@blogs_bp.route("/<post_id>", methods=["GET"])
def get_post_by_id(post_id):
  post = validate_post(post_id)

  return jsonify(post.to_dictionary())

@blogs_bp.route("/<post_id>", methods=["PUT"])
def replace_post_by_id(post_id):
  request_body = request.get_json()
  post = validate_post(post_id)
  
  post.tile = request_body["title"]
  post.date = request_body["date"]
  post.body = request_body["body"]

  db.session.commit()

  return jsonify(post.to_dictionary())

@blogs_bp.route("/<post_id>", methods=["DELETE"])
def delete_post_by_id(post_id):
  post = validate_post(post_id)

  db.session.delete(post)
  db.session.commit()

  return make_response(jsonify(f"Post {post.title} successfully deleted."))

@blogs_bp.route("/<post_id>", methods=["PATCH"])
def update_post_with_id(post_id):
  post = validate_post(post_id)
  request_body = request.get_json()
  post_keys = request_body.keys()

  if "title" in post_keys:
    post.title = request_body['title']

  if "body" in post_keys:
    post.body = request_body['body']
  
  db.session.commit()

  return jsonify(post.to_dictionary())


def validate_post(post_id):
  try:
    post_id = int(post_id)
  except:
    abort(make_response({"message": f"post {post_id} invalid"}, 400))
  
  post = Post.query.get(post_id)

  if not post:
    abort(make_response({"message": f"post {post_id} not found"}, 404))

  return post
