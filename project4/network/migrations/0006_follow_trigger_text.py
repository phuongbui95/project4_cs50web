# Generated by Django 4.1.7 on 2023-06-18 18:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0005_follow'),
    ]

    operations = [
        migrations.AddField(
            model_name='follow',
            name='trigger_text',
            field=models.CharField(blank=True, max_length=10),
        ),
    ]