# Generated by Django 4.1.7 on 2023-06-27 08:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0010_remove_post_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='likeNum',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
