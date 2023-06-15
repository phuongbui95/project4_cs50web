from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    follower = models.ManyToManyField("self", related_name="main_follower", null=True)
    following = models.ManyToManyField("self", related_name="main_following", null=True)
    def __str__(self):
        return self.username

##--- Additional models ---##
# Post
class Post(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="posts", null=True) # key to connect with User model
    sender = models.ForeignKey("User", on_delete=models.PROTECT, related_name="posts_sent", null=True ) #PROTECT, not CASCADE
    # following = models.ManyToManyField("User", related_name="posts_following")
    content = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    likeNum = models.PositiveBigIntegerField(default=0)

    def serialize(self):
        return {
            "id": self.id,
            "sender": self.sender.username,
            # "following": [user.username for user in self.following.all()],
            "content": self.content,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "like_number": self.likeNum
        }

# Follower
# class Follow(models.Model):
#     user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="main_user", null=True) # key to connect with User model
#     follower = models.ManyToManyField("User", related_name="main_follower", null=True)
#     following = models.ManyToManyField("User", related_name="main_following", null=True)
    # timestamp = models.DateTimeField(auto_now_add=True)

# Like