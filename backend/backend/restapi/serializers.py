from rest_framework import serializers
from .models import Recipe
from .models import Recipe, Ingredient, Tag

from django.core.exceptions import ValidationError


class TagSerializer(serializers.Serializer):
    name = serializers.ListSerializer(
        child=serializers.CharField(max_length=100))

    def to_representation(self, instance):
        if isinstance(instance, Tag):
            return instance.name
        return [tag.name for tag in instance]

    def to_internal_value(self, data):
        return {'name': data}

    def create(self, validated_data):
        tags_data = validated_data.pop('name')
        tags = []
        for tag_data in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag_data)
            tags.append(tag)
        return tags


class IngredientSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    quantity = serializers.FloatField(
        required=False, allow_null=True)
    unit = serializers.CharField(
        max_length=20, required=False, allow_blank=True)


class RecipeSerializer(serializers.ModelSerializer):
    creator = serializers.SerializerMethodField()

    def validate_title(self, value):
        if len(value) < 5:
            raise serializers.ValidationError(
                "Title must be at least 5 characters long.")
        return value

    class Meta:
        model = Recipe
        fields = (
            'id',
            'absolute_url',
            'detail_url',
            'title',
            'publisher',
            'publisher_url',
            'tags',
            'description',
            'cooking_time',
            'servings',
            'ingredients',
            'creator',
            'image_url',
        )
    # publisher = PublisherSerializer(many=False)
    tags = TagSerializer(many=True)
    ingredients = IngredientSerializer(
        many=True)
    absolute_url = serializers.HyperlinkedIdentityField(
        view_name='recipe-detail',
        lookup_field='pk'
    )

    def get_creator(self, obj):
        return obj.creator.username

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        ingredients_data = validated_data.pop('ingredients', [])

        recipe = Recipe.objects.create(**validated_data)

        for tag_data in tags_data:
            tag, _ = Tag.objects.get_or_create(name=tag_data['name'])
            recipe.tags.add(tag)

        for ingredient_data in ingredients_data:
            ingredient, _ = Ingredient.objects.get_or_create(name=ingredient_data['name'].lower(
            ), unit=ingredient_data['unit'].lower(), defaults={'quantity': ingredient_data['quantity']})
            recipe.ingredients.add(ingredient)

        return recipe

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', [])
        ingredients_data = validated_data.pop('ingredients', [])

        # Update the fields of the instance with the validated data
        instance.detail_url = validated_data.get(
            'detail_url', instance.detail_url)
        instance.image_url = validated_data.get(
            'image_url', instance.image_url)
        instance.title = validated_data.get('title', instance.title)
        instance.publisher = validated_data.get(
            'publisher', instance.publisher)
        instance.publisher_url = validated_data.get(
            'publisher_url', instance.publisher_url)
        instance.description = validated_data.get(
            'description', instance.description)
        instance.servings = validated_data.get('servings', instance.servings)
        instance.cooking_time = validated_data.get(
            'cooking_time', instance.cooking_time)
        instance.creator = validated_data.get('creator', instance.creator)

        # Update the tags of the recipe
        instance.tags.clear()  # Remove existing tags
        for tag_data in tags_data:
            tag, _ = Tag.objects.get_or_create(name=tag_data['name'])
            instance.tags.add(tag)

        # Update the ingredients of the recipe
        instance.ingredients.clear()  # Remove existing ingredients
        for ingredient_data in ingredients_data:
            ingredient, _ = Ingredient.objects.get_or_create(
                name=ingredient_data['name'].lower(),
                unit=ingredient_data['unit'].lower(),
                defaults={'quantity': ingredient_data['quantity']}
            )
            instance.ingredients.add(ingredient)

        instance.save()
        return instance


class RecipeAddSerializer(serializers.ModelSerializer):
    creator = serializers.SerializerMethodField()

    def validate_title(self, value):
        if len(value) < 5:
            raise serializers.ValidationError(
                "Title must be at least 5 characters long.")
        return value

    class Meta:
        model = Recipe
        fields = (
            'detail_url',
            'title',
            'publisher',
            'publisher_url',
            'tags',
            'description',
            'cooking_time',
            'servings',
            'ingredients',
            'creator',
            'image_url',
        )
    tags = TagSerializer(many=True)
    ingredients = IngredientSerializer(
        many=True)

    def get_creator(self, obj):
        return obj.creator.username

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        ingredients_data = validated_data.pop('ingredients', [])

        recipe = Recipe.objects.create(**validated_data)

        for tag_data in tags_data:
            tag, _ = Tag.objects.get_or_create(name=tag_data['name'])
            recipe.tags.add(tag)

        for ingredient_data in ingredients_data:
            ingredient, _ = Ingredient.objects.get_or_create(name=ingredient_data['name'].lower(
            ), unit=ingredient_data['unit'].lower(), defaults={'quantity': ingredient_data['quantity']})
            recipe.ingredients.add(ingredient)

        return recipe

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', [])
        ingredients_data = validated_data.pop('ingredients', [])
        print(validated_data)

        # Update the fields of the instance with the validated data
        instance.detail_url = validated_data.get(
            'detail_url', instance.detail_url)
        instance.image_url = validated_data.get(
            'image_url', instance.image_url)
        instance.title = validated_data.get('title', instance.title)
        instance.publisher = validated_data.get(
            'publisher', instance.publisher)
        instance.publisher_url = validated_data.get(
            'publisher_url', instance.publisher_url)
        instance.description = validated_data.get(
            'description', instance.description)
        instance.servings = validated_data.get('servings', instance.servings)
        instance.cooking_time = validated_data.get(
            'cooking_time', instance.cooking_time)
        instance.creator = validated_data.get('creator', instance.creator)

        # Update the tags of the recipe
        instance.tags.clear()  # Remove existing tags
        for tag_data in tags_data:
            tag, _ = Tag.objects.get_or_create(name=tag_data['name'])
            instance.tags.add(tag)

        # Update the ingredients of the recipe
        instance.ingredients.clear()  # Remove existing ingredients
        for ingredient_data in ingredients_data:
            ingredient, _ = Ingredient.objects.get_or_create(
                name=ingredient_data['name'].lower(),
                unit=ingredient_data['unit'].lower(),
                defaults={'quantity': ingredient_data['quantity']}
            )
            instance.ingredients.add(ingredient)

        instance.save()
        return instance


class RecipeListSerializer(serializers.ModelSerializer):
    creator = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = (
            'id',
            'absolute_url',
            'detail_url',
            'title',
            'publisher',
            'publisher_url',
            'tags',
            'creator',
            'image_url',
        )

    def get_creator(self, obj):
        return obj.creator.username

    tags = TagSerializer(many=True)

    absolute_url = serializers.HyperlinkedIdentityField(
        view_name='recipe-detail',
        lookup_field='pk'
    )
