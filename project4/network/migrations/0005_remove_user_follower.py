# Generated by Django 4.1.7 on 2023-06-16 12:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0004_user_follower_user_following_delete_follow'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='follower',
        ),
    ]
