# Generated by Django 5.1.4 on 2025-02-23 08:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authapi', '0002_remove_customuser_is_approved'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='role',
            field=models.CharField(choices=[('admin', 'Admin'), ('user', 'User'), ('collector', 'Collector')], max_length=10),
        ),
    ]
