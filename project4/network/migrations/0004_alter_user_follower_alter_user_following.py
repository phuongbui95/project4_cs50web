# Generated by Django 4.1.7 on 2023-06-18 17:30

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0003_user_follower'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='follower',
            field=models.ManyToManyField(blank=True, related_name='is_being_followed', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='user',
            name='following',
            field=models.ManyToManyField(blank=True, related_name='is_following', to=settings.AUTH_USER_MODEL),
        ),
    ]