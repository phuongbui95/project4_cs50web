from django.contrib import admin
from .models import User, Post #, Like #, Follow

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
        return " ".join([str(b) for b in obj.following.all()])
    def get_follower(self, obj):    
        return " ".join([str(b) for b in obj.follower.all()])

    get_following.short_description = 'Following'
    get_follower.short_description = 'Follower'

class PostAdmin(admin.ModelAdmin):
    list_display = ("id","sender","content","timestamp","get_like")
    filter_horizontal = (
                    'likePeople',
                    ) #present a ManyToManyField in Django Admin Interface
    
    def get_like(self, obj):    
        return " ".join([str(b) for b in obj.likePeople.all()])

    get_like.short_description = 'who_liked'

admin.site.register(User, UserAdmin)
admin.site.register(Post, PostAdmin)


