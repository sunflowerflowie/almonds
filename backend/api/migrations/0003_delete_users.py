# Generated by Django 5.0.3 on 2024-04-09 08:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_users'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Users',
        ),
    ]
