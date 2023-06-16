from django.contrib import admin
from .models import User, Post#, Follow

# Register your models here.
class UserAdmin(admin.ModelAdmin):
    # list_display = ("id", "username")
    list_display = ('id', 'username'
                    # , 'get_follower'
                    , 'get_following'
                    )
    filter_horizontal = (
                    'following',
                    # 'follower'
                    
                    ) #present a ManyToManyField in Django Admin Interface

    # def get_follower(self, obj):
    #     # pass
    #     return "\n".join([str(b) for b in obj.follower.all()])
    def get_following(self, obj):
        # pass
        return "\n".join([str(b) for b in obj.following.all()])

    # get_follower.short_description = 'Followers'
    get_following.short_description = 'Following'

class PostAdmin(admin.ModelAdmin):
    list_display = ("id","sender","content","timestamp","likeNum")

# class FollowAdmin(admin.ModelAdmin):
#     list_display = ('id', 'user', 'get_follower', 'get_following')
#     filter_horizontal = ('follower','following') #present a ManyToManyField in Django Admin Interface

#     def get_follower(self, obj):
#         # pass
#         return "\n".join([str(b) for b in obj.follower.all()])
#     def get_following(self, obj):
#         # pass
#         return "\n".join([str(b) for b in obj.following.all()])

#     get_follower.short_description = 'Followers'
#     get_following.short_description = 'Following'
    

admin.site.register(User, UserAdmin)
admin.site.register(Post, PostAdmin)
# admin.site.register(Follow, FollowAdmin)