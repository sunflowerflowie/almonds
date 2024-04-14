from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from connection.models import DatabaseConnections
from .models import DatabaseConnections, DataTables, AssetAttributes
from .utils import store_table_names, create_database_connection, fetch_table_names, store_table_attributes, fetch_table_attributes


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
        if tables:
            # Store table names in the DataTables model
            store_table_names(tables, connection)
            table_list = [{'table_name': name[0]} for name in tables]
            return JsonResponse({'tables': table_list}, safe=False)
        else:
            return JsonResponse({'error': 'No tables found or unable to fetch tables'}, status=404)
    
    except DatabaseConnections.DoesNotExist:
        return JsonResponse({'error': 'Database connection not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
@require_http_methods(["GET"])
def get_attributes_for_table(request, connection_id, table_name):
    try:
        connection = DatabaseConnections.objects.get(connection_id=connection_id)
        db_conn = create_database_connection(connection)
        if db_conn is None:
            return JsonResponse({'error': 'Failed to connect to database'}, status=500)

        attributes = fetch_table_attributes(db_conn, table_name)
        if attributes:
            store_table_attributes(table_name, attributes, connection)
            attributes_list = [{
                'column_name': attr['column_name'],
                'data_type': attr['data_type'],
                'is_primary_key': attr['is_primary_key'],
                'is_foreign_key': attr['is_foreign_key']
            } for attr in attributes]
            return JsonResponse({'attributes': attributes_list}, safe=False)
        else:
            return JsonResponse({'error': 'No attributes found or unable to fetch attributes'}, status=404)
        
    except DatabaseConnections.DoesNotExist:
        return JsonResponse({'error': 'Database connection not found'}, status=404)
    except DataTables.DoesNotExist:
        return JsonResponse({'error': 'Data table not found for provided connection'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)