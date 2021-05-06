from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.core.mail import EmailMessage
from rest_framework.authtoken.models import Token
from rest_framework import viewsets, permissions, exceptions
from .serializers import UserRegisterSerializer, UsersSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.core.serializers import json


# Widok rejestrowania/tworzenia uzytkownika
class UserRegisterViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.none()

    # Lista serializerii dla danech typów zapytań
    serializer_classes = {
        'POST': UserRegisterSerializer,
    }

    # Jeżeli danego zapytania nie ma na liście serializer_classes to wykorzystany będzie domyślny
    default_serializer_class = UserRegisterSerializer
    
    # Metoda wybiera z jakiego serializera będziemy korzystać
    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.default_serializer_class)

# Widok pobierania informacji o użytkowniku
class UsersViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.none()
    # Wymagane podanie tokena w nagłowku zapytania
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    
    # Lista serializerii dla danech typów zapytań
    serializer_classes = {
        'GET': UsersSerializer,
    }

    # Jeżeli danego zapytania nie ma na liście serializer_classes to wykorzystany będzie domyślny
    default_serializer_class = UsersSerializer
    
    # Metoda przygotowuje nam dane do zwrócenia - my potrzebujemy informacji o jednym użytkowniku
    def get_queryset(self):
        # Pobieramy token wykorzystując klucz otrzymany z zapytania
        token = Token.objects.filter(key=self.request.query_params.get('token'))
        # Pobieramy uzytkownika przypisanego do danego tokenu - model Token musi być 'wyłuszczony'
        user = [t.user for t in token]
        # Zwracamy uzytkownika
        return user

    # Metoda wybiera z jakiego serializera będziemy korzystać
    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.default_serializer_class)

# Widok pobierania informacji o aktywacji konta użytkownika
class UsersActivatedViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.none()

    # Wymagane podanie tokena w nagłowku zapytania
    authentication_classes = []
    permission_classes = []

    # Lista serializerii dla danech typów zapytań
    serializer_classes = {
        'GET': UsersSerializer,
    }

    # Jeżeli danego zapytania nie ma na liście serializer_classes to wykorzystany będzie domyślny
    default_serializer_class = UsersSerializer
    
    # Metoda przygotowuje nam dane do zwrócenia - my potrzebujemy informacji o jednym użytkowniku
    def get_queryset(self):
        # Zwracamy uzytkownika
        user = get_user_model().objects.all()#.filter(email=self.request.query_params.get('email'))
        return user

    # Metoda wybiera z jakiego serializera będziemy korzystać
    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.default_serializer_class)
