# Generated by Django 4.1.7 on 2023-06-20 04:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0007_alter_follow_trigger_text'),
    ]

    operations = [
        migrations.AlterField(
            model_name='follow',
            name='trigger_text',
            field=models.CharField(choices=[('follow', 'Follow'), ('unfollow', 'UnFollow')], default='follow', max_length=10),
        ),
    ]
