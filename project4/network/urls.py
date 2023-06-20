
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API routes
    path("posts", views.compose, name="compose"),
    path("posts/<int:post_id>", views.post, name="post"),
    # path("posts/<str:viewpage>/<int:page_number>", views.viewpage, name="viewpage"),
    path("posts/<str:viewpage>", views.viewpage, name="viewpage"),
    path("profiles/<str:username>", views.profile, name="profile"),
    path("follow", views.follow, name="follow")
]
