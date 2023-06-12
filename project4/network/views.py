from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render
from django.urls import reverse

import json
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt

import time

from .models import User, Post


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

    
@login_required
def compose(request):
    # Composing a new post must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)
    
    # Get content of post
    data = json.loads(request.body) #body?
    content = data.get("body", "")

    # Create a post for all users, plus sender (go to viewpage = "all posts")
    recipients = User.objects.all().username
    users = set()
    users.add(request.user)
    users.update(recipients)    
    for user in users:
        post = Post(
            sender=user,
            content=content
        )
        post.save()
    return JsonResponse({"message": "Email sent successfully."}, status=201)

def viewpage(request, viewpage):
    if viewpage == "all-posts":
        posts = Post.objects.all()
    elif viewpage == "following":
        return JsonResponse({"message": "TBA"}, status=201)
    elif viewpage == "profile":
        posts = Post.objects.filter(sender=request.user)
        # return JsonResponse({"message": "TBA"}, status=201)
    else:
        return JsonResponse({"message": "Invalid viewpage"}, status=400)
    
    # Return posts in reverse chronological order
    posts = posts.order_by("-timestamp").all()
    return JsonResponse([post.serialize() for post in posts], safe=False)

@login_required
def post(request, post_id):
    # Query for requested post
    try:
        post = Post.objects.get(sender=request.user, pk=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)
    
    # Return post contents
    if request.method == "GET":
        return JsonResponse(post.serialize())
    # Edit post
    elif request.method == "PUT":
        pass
    # Post must be via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)

    

    