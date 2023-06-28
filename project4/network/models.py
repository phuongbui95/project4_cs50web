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
    sender = models.ForeignKey("User", on_delete=models.PROTECT, related_name="posts_sent", null=True ) #PROTECT, not CASCADE
    content = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    # likeNum = models.PositiveIntegerField(default=0)
    likePeople = models.ManyToManyField('User', related_name="who_clicked_like", blank=True, symmetrical=False)

    def serialize(self):
        return {
            "id": self.id,
            "sender": self.sender.username,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            # "likeNum": self.likeNum # be careful with how you set the name
            "likePeople": self.likePeople
        }

# Follow
# class Follow(models.Model):
#     user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="who_clicked_btn", null=True) 
#     user_followed = models.ForeignKey("User", on_delete=models.CASCADE, related_name="who_is_followed", null=True )
#     TRIGGER_CHOICES = [
#         ("follow", "Follow"),
#         ("unfollow", "UnFollow"),
#     ]
#     trigger_text = models.CharField(
#         max_length=10,
#         choices=TRIGGER_CHOICES,
#         default="follow",
#     )

# Like
# class Like(models.Model):
#     post_id = models.ForeignKey("Post", on_delete=models.CASCADE, blank=True)
#     owner = models.ForeignKey("User", on_delete=models.CASCADE, related_name="who_created_post", null=True )
#     user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="who_liked_post", null=True) 
#     like_status = models.CharField(max_length=10, default="liked")
    
