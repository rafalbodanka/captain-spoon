# Generated by Django 4.2 on 2023-07-25 17:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restapi', '0003_rename_absolute_url_recipe_publisher_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipe',
            name='image_url',
            field=models.URLField(blank=True, max_length=1000),
        ),
    ]
