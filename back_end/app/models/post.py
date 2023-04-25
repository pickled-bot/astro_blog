from app import db
from datetime import datetime


class Post(db.Model):
  id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  date = db.Column(db.DateTime(timezone=True), default=datetime.astimezone)
  title = db.Column(db.String, nullable=False)
  body = db.Column(db.String)

  def to_string(self):
    return f"{self.id}: [{self.date}], {self.title}, Body: {self.body}"

  def to_dictionary(self):
    return dict(
      id = self.id,
      date = self.date,
      title = self.title,
      body = self.body)
  @classmethod
  def from_dict(cls, data_dict):
    return cls(
      date=data_dict['date'],
      title=data_dict['title'],
      body=data_dict['body']
    )
  def replace_details(self, data_dict):
    self.date = data_dict['date']
    self.title = data_dict['title']
    self.body = data_dict['body']
