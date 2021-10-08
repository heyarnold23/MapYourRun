from .db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .runs import runners_runs



friends = db.Table(
    "friends",
    db.Column("runner1_id", db.Integer, db.ForeignKey("users.id")),
    db.Column("runner2_id", db.Integer, db.ForeignKey("users.id"))
)

pending_friends = db.Table(
    "pending_friends",
    db.Column("acceptor_id", db.Integer, db.ForeignKey("users.id")),
    db.Column("requester_id", db.Integer, db.ForeignKey("users.id"))
)


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    age = db.Column(db.Integer,nullable=False)
    height = db.Column(db.String(10),nullable=False)
    weight = db.Column(db.Integer,nullable=False)

    friends_association = db.relationship("User", secondary=friends, primaryjoin=(friends.c.runner1_id),
    secondaryjoin=(friends.c.runner2_id), backref=db.backref("friends", lazy="dynamic"), lazy="dynamic")

    pending_friends_association = db.relationship("User", secondary=pending_friends, primaryjoin=(pending_friends.c.acceptor_id),
    secondaryjoin=(pending_friends.c.requester_id), backref=db.backref("pending_friends", lazy="dynamic"), lazy="dynamic")

    runs = db.relationship("Run", secondary=runners_runs,back_populates = "users")




    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'age':self.age,
            'weight':self.weight,
            'height':self.height
        }
