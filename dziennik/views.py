from django.contrib.auth import get_user_model
from rest_framework import viewsets
from .serializers import UserRegisterSerializer, UsersSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

class UserRegisterViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.none()

    serializer_classes = {
        'create': UserRegisterSerializer,
    }

    default_serializer_class = UserRegisterSerializer
    
    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.default_serializer_class)
    
class UsersViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    
    serializer_classes = {
        'GET': UsersSerializer,
    }

    default_serializer_class = UsersSerializer
    
    def get_queryset(self):
        return get_user_model().objects.filter(email=self.request.query_params.get('email'))

    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.default_serializer_class)