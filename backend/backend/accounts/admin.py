from django.contrib import admin

from .models import UserBookmarks

@admin.register(UserBookmarks)
class BookmarksAdmin(admin.ModelAdmin):
    pass