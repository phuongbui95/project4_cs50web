from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    def __str__(self):
        return self.username

##--- Additional models ---##
# Post
class Post(models.Model):
    sender = models.ForeignKey("User", on_delete=models.CASCADE, null=True)
    content = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    likeNum = models.PositiveBigIntegerField(default=0)

    def serialize(self):
        return {
            "id": self.id,
            "sender": self.sender,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "like_number": self.likeNum,
        }

# Like

# Follower