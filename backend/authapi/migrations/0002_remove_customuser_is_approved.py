# Generated by Django 5.1.4 on 2024-12-09 09:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authapi', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='is_approved',
        ),
    ]
