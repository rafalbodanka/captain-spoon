# Generated by Django 4.2 on 2023-07-12 16:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('restapi', '0002_recipe_detail_url'),
    ]

    operations = [
        migrations.RenameField(
            model_name='recipe',
            old_name='absolute_url',
            new_name='publisher_url',
        ),
    ]
