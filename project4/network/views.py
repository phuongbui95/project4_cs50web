from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

import json
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt

from .models import User, Post
from django.core.paginator import Paginator

def index(request):
    # Authenticated users view their inbox
    if request.user.is_authenticated:
        return render(request, "network/index.html")

    # Everyone else is prompted to sign in
    else:
        return HttpResponseRedirect(reverse("login"))
    


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

# def viewpage(request, viewpage, page_number=1):
def viewpage(request, viewpage):
    # Viewpage's conditions
    if viewpage == "all":
        posts = Post.objects.all()

    elif viewpage == "following":
        user = User.objects.get(username=request.user)
        following = user.following.all()
        posts = Post.objects.filter(sender__in=following) # Django lookup __in

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
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)
    
    # Return post contents
    if request.method == "GET":
        return JsonResponse(post.serialize())
        
    # Edit post
    elif request.method == "PUT":
        # Get content of post
        data = json.loads(request.body)
        # content = data.get("content", "")

        # Update post's content
        if data["content"] is not None:
            post.content = data["content"]
        # # Update post's likeNum
        # if data["likeNum"] is not None:
        #     post.content = data["likeNum"]

        # Save the update
        post.save()

        return JsonResponse({"message": "Post edited successfully."}, status=201)
    # Post must be via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)


@login_required
def profile(request, username):
    try:
        profile = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found."}, status=404)
    
    # Return follow_profile contents
    if request.method == "GET":
        return JsonResponse(profile.serialize())   
    else:
        return JsonResponse({
            "error": "Invalid profile"
        }, status=400) 
    

@csrf_exempt
@login_required
def follow(request):
    # Clicking follow-btn will trigger a POST request
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)
    
    # Get content of post
    data = json.loads(request.body)
    trigger_text = data.get("trigger_text", "")
    user = data.get("user", "")
    user_followed = data.get("user_followed", "")

    who_is_followed = User.objects.get(username = user_followed)
    who_clicked_follow = User.objects.get(username = user)
    # Follow
    if trigger_text == "follow":
        who_is_followed.follower.add(who_clicked_follow)
        who_clicked_follow.following.add(who_is_followed)    
    # Unfollow
    elif trigger_text == "unfollow":
        who_is_followed.follower.remove(who_clicked_follow)
        who_clicked_follow.following.remove(who_is_followed)    
    
    who_is_followed.save()
    who_clicked_follow.save()
 
    return JsonResponse({"message": "Post sent successfully."}, status=201)

@csrf_exempt
@login_required
def like(request):
    # Clicking follow-btn will trigger a POST request
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)
    
    # Get body of POST request
    data = json.loads(request.body)
    who_clicked = request.user
    post_owner = data.get("owner","")
    trigger_text = data.get("trigger_text","")
    post_id = data.get("post_id","")

    user_who_clicked = User.objects.get(username = who_clicked)
    post = Post.objects.get(pk=post_id)
    if trigger_text == "like":
        post.likePeople.add(user_who_clicked)
    else:
        post.likePeople.remove(user_who_clicked)
    
    post.save()
 
    return JsonResponse({"message": f"{who_clicked} liked post {post_id} of {post_owner} successfully."}, status=201)