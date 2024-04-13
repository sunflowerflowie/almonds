# catalog/urls.py

from django.urls import path
from .views import get_tables_for_connection

urlpatterns = [
    path('tables/<int:connection_id>/', get_tables_for_connection, name='database-tables'),
]
