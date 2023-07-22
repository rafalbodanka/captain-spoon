from django.contrib import admin
# from .models import Tag, Recipe, Ingredient
from .models import Recipe, Tag, Ingredient

# Register your models here.


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    pass


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    pass


@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    pass
