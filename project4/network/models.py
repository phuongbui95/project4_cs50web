from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    following = models.ManyToManyField('self', related_name="is_following", blank=True, symmetrical=False)
    follower = models.ManyToManyField('self', related_name="is_being_followed", blank=True, symmetrical=False)

    def __str__(self):
        return self.username

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "following": [self.username for self in self.following.all()],
            "follower": [self.username for self in self.follower.all()]
        }
    
##--- Additional models ---##
# Post
class Post(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="posts", null=True) # key to connect with User model
    sender = models.ForeignKey("User", on_delete=models.PROTECT, related_name="posts_sent", null=True ) #PROTECT, not CASCADE
    content = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    likeNum = models.PositiveBigIntegerField(default=0)

    def serialize(self):
        return {
            "id": self.id,
            "sender": self.sender.username,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "like_number": self.likeNum
        }



# Like