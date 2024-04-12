from django.shortcuts import render
from rest_framework import generics
from .serializers import ConnectionSerializer, DatabasePlatformSerializer 
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import DatabasePlatforms, DatabaseConnections


class DatabasePlatformList(generics.ListAPIView):
    queryset = DatabasePlatforms.objects.all()
    serializer_class = DatabasePlatformSerializer

class ConnectionListCreate(generics.ListCreateAPIView):
    serializer_class = ConnectionSerializer
    permission_classes = [IsAuthenticated] # Logged in before interact with api

    def get_queryset(self):
        user = self.request.user

        return DatabaseConnections.objects.filter(created_by=user) # Can only see their own Note
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(created_by=self.request.user)
        else:
            print(serializer.errors)

class ConnectionDelete(generics.DestroyAPIView):
    queryset = DatabaseConnections.objects.all()
    serializer_class = ConnectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        return DatabaseConnections.objects.filter(created_by=user)