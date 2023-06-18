from django.contrib import admin
from .models import User, Post, Follow

# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username'
                    , 'get_following'
                    , 'get_follower'
                    )
    filter_horizontal = (
                    'following',
                    ) #present a ManyToManyField in Django Admin Interface
    
    def get_following(self, obj):    
        return "\n".join([str(b) for b in obj.following.all()])
    def get_follower(self, obj):    
        return "\n".join([str(b) for b in obj.follower.all()])

    get_following.short_description = 'Following'
    get_follower.short_description = 'Follower'

class PostAdmin(admin.ModelAdmin):
    list_display = ("id","sender","content","timestamp","likeNum")

class FollowAdmin(admin.ModelAdmin):
    list_display = ("id","user","user_followed","trigger_text")


admin.site.register(User, UserAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Follow, FollowAdmin)

