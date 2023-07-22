from django.db import models

from django.contrib.auth.models import User

from backend.restapi.models import Recipe

class UserBookmarks(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bookmarks = models.ManyToManyField(Recipe)

    def __str__(self):
        return self.user.username
