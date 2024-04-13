from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from connection.models import DatabaseConnections
from .models import DataTables
from .utils import fetch_table_names, create_database_connection


@require_http_methods(["GET"])
def get_tables_for_connection(request, connection_id):
    try:
        # Get the database connection info
        connection = DatabaseConnections.objects.get(connection_id=connection_id)
        # Create database connection
        db_conn = create_database_connection(connection)
        if db_conn is None:
            return JsonResponse({'error': 'Failed to connect to database'}, status=500)

        # Fetch tables
        tables = fetch_table_names(db_conn)
        table_list = [{'table_name': name[0]} for name in tables] if tables else []
        return JsonResponse({'tables': table_list}, safe=False)
    except DatabaseConnections.DoesNotExist:
        return JsonResponse({'error': 'Database connection not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)