from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    def __str__(self):
        return self.username

##--- Additional models ---##
# Post
class Post(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="post_owner")
    content = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    likeNum = models.PositiveBigIntegerField(default=0)

# Like

# Follower