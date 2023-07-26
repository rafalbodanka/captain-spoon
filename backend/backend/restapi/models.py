from django.db import models
from django.urls import reverse

from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db.models import UniqueConstraint
from django.db.models.functions import Lower


def validate_tag_name(value):
    if len(value.split()) > 1:
        raise ValidationError('Tag name should contain only one word.')


def validate_quantity(value):
    if value <= 0:
        raise ValidationError('Quantity must be greater than zero.')


class Tag(models.Model):
    name = models.CharField(max_length=255, validators=[
                            validate_tag_name], unique=True)

    def __str__(self) -> str:
        return self.name


class Ingredient(models.Model):
    name = models.CharField(max_length=255)
    quantity = models.FloatField(
        null=True, blank=True, validators=[validate_quantity])
    unit = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        constraints = [
            UniqueConstraint(
                Lower('name'),
                'quantity',
                Lower('unit'),
                name='unique_ingredient',
            )
        ]


class Recipe(models.Model):
    detail_url = models.URLField(blank=True)
    title = models.CharField(max_length=255)
    creator = models.ForeignKey(
        User, on_delete=models.CASCADE, default=None)
    publisher = models.TextField()
    description = models.TextField()
    cooking_time = models.PositiveIntegerField(default=60)
    servings = models.PositiveIntegerField(default=4)
    ingredients = models.ManyToManyField(Ingredient)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    publisher_url = models.URLField(blank=True)
    image_url = models.URLField(max_length=1000, blank=True)
    tags = models.ManyToManyField(Tag)

    def __str__(self):
        return self.title

    def get_publisher_url(self):
        return reverse('recipe-detail', args=[str(self.id)])

    def get_image_url(self):
        if self.image_url:
            return reverse('recipe-image', args=[str(self.id)])
        else:
            return None


class RecipeTag(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)


class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
