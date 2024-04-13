from django.contrib.auth.models import User
from rest_framework import serializers
from .models import DatabasePlatforms, DatabaseConnections


class ConnectionSerializer(serializers.ModelSerializer):
    platform_name = serializers.ReadOnlyField(source='platform.platform_name')

    class Meta:
        model = DatabaseConnections
        fields = ["connection_id",
                  "database_name",
                  "hostname",
                  "port",
                  "username",
                  "password",
                  "description",
                  "created_by",
                  "platform",
                  "platform_name"]
        extra_kwargs = {"created_by": {"read_only": True},
                        "platform": {"write_only": True}}

class DatabasePlatformSerializer(serializers.ModelSerializer):
    class Meta:
        model = DatabasePlatforms
        fields = ['platform_id', 'platform_name']