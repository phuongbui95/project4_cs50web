from django.contrib import admin
from .models import User, Post

# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username")

class PostAdmin(admin.ModelAdmin):
    list_display = ("id","user","content","timestamp","likeNum")

admin.site.register(User, UserAdmin)
admin.site.register(Post, PostAdmin)