import psycopg2
from django.db import transaction
from connection.models import DatabaseConnections
from .models import DataTables, AssetAttributes

"""
Handles the creation of a database connection.
"""
def create_database_connection(connection):
    try:
        conn = psycopg2.connect(
            dbname=connection.database_name,
            user=connection.username,
            password=connection.password,
            host=connection.hostname,
            port=connection.port
        )

        return conn
    except Exception as e:
        print(f"Error connecting to database {connection.database_name}: {e}")

        return None
    
"""
Fetches table names from the given database connection.
"""    
def fetch_table_names(conn):
    if conn is not None:
        cursor = conn.cursor()
        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
        table_names = cursor.fetchall()
        cursor.close()
        conn.close()

        return table_names
    
    return []

"""
Saves fetched table names into the DataTables model.
"""
def store_table_names(table_names, connection):
    with transaction.atomic():
        for table_name in table_names:
            DataTables.objects.update_or_create(
                table_name=table_name[0],  # table_name is a tuple
                connection=connection,
                defaults={'table_name': table_name[0]}
            )

"""
Update data tables from all database connections.
"""
def update_data_tables():
    connections = DatabaseConnections.objects.all()
    for connection in connections:
        conn = create_database_connection(connection)
        table_names = fetch_table_names(conn)
        if table_names:
            store_table_names(table_names, connection)
