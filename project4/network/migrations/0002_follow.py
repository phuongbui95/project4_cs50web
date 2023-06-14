# Generated by Django 4.1.7 on 2023-06-14 11:01

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Follow',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('follower', models.ManyToManyField(related_name='main_follower', to=settings.AUTH_USER_MODEL)),
                ('following', models.ManyToManyField(related_name='main_following', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='main_user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
