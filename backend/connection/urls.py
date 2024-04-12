from django.urls import path
from . import views

urlpatterns = [
    path("forms/", views.ConnectionListCreate.as_view(), name="connection-list"),
    path("forms/delete/<int:pk>/", views.ConnectionDelete.as_view(), name="delete-connection"),
    path("platforms/", views.DatabasePlatformList.as_view(), name="platform-list"),
]