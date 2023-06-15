# Generated by Django 4.1.7 on 2023-06-15 06:57

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0003_alter_follow_follower_alter_follow_following'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='follower',
            field=models.ManyToManyField(null=True, related_name='main_follower', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='user',
            name='following',
            field=models.ManyToManyField(null=True, related_name='main_following', to=settings.AUTH_USER_MODEL),
        ),
        migrations.DeleteModel(
            name='Follow',
        ),
    ]
