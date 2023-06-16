from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
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


@csrf_exempt
@login_required
def compose(request):
    # Composing a new post must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)
    
    # Get content of post
    data = json.loads(request.body)
    content = data.get("content", "")

    # Get the user instance from the database
    post = Post(
        sender=request.user,
        content=content
    )
    post.save()

    return JsonResponse({"message": "Post sent successfully."}, status=201)

def viewpage(request, viewpage):
    # Viewpage's conditions
    if viewpage == "all":
        posts = Post.objects.all()
    elif viewpage == "following":
        return JsonResponse({"message": "TBA"}, status=201)
    elif viewpage == "profile":
        posts = Post.objects.filter(sender=request.user)
    elif User.objects.get(username=viewpage): #cannot use this line out of the condition statment => it will break Json
        posts = Post.objects.filter(sender=User.objects.get(username=viewpage))
    else:
        return JsonResponse({"message": "Invalid viewpage"}, status=400)
    
    # Return posts in reverse chronological order
    posts = posts.order_by("-timestamp").all()
    return JsonResponse([post.serialize() for post in posts], safe=False)

@csrf_exempt
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

@csrf_exempt
@login_required
def follow(request, username):
    # Query for requested profile
    try:
        profile = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found."}, status=404)
    
    # Return profile contents
    if request.method == "GET":
        return JsonResponse(profile.serialize())
        
    # Edit profile
    elif request.method == "PUT":
        data = json.loads(request.body)      
        # To assign a value to a many-to-many field, you should use the set() method.
        following_users = data["following"]
        for user in following_users:
            profile.following.add(user)
        follower_users = data["follower"]
        for user in follower_users:
            profile.follower.add(user)
        profile.save()
        # return HttpResponse(status=204)
        return HttpResponse(profile)

    # Profile must be via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400) 

    