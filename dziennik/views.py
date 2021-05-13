from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.core.mail import EmailMessage
from rest_framework.authtoken.models import Token
from rest_framework import viewsets, permissions, exceptions
from .serializers import UserRegisterSerializer, UsersSerializer, UsersActivatedSerializer, InstitutionRegisterSerializer, InstitutionNameExistSerializer, UsersGetActivities, UserCreateChildSerializer, EmployeeRegisterSerializer
from .models import Activity, Employee, UserActivate, Child
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.core.serializers import json

#  _   _   ____    _____   ____
# | | | | / ___|  | ____| |  _ \ 
# | | | | \___ \  |  _|   | |_) |
# | |_| |  ___) | | |___  |  _ < 
#  \___/  |____/  |_____| |_| \_\
#

# Widok rejestrowania/tworzenia użytkownika
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
        'GET': UsersActivatedSerializer,
    }

    # Jeżeli danego zapytania nie ma na liście serializer_classes to wykorzystany będzie domyślny
    default_serializer_class = UsersActivatedSerializer
    
    # Metoda przygotowuje nam dane do zwrócenia - my potrzebujemy informacji o jednym użytkowniku
    def get_queryset(self):
        # Zwracamy uzytkownika
        user = get_user_model().objects.filter(email=self.request.query_params.get('email'))
        return user

    # Metoda wybiera z jakiego serializera będziemy korzystać
    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.default_serializer_class)

# Widok do aktywacji konta użytkownika
class UsersActivationAccountViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.none()

    # Wymagane podanie tokena w nagłowku zapytania
    authentication_classes = []
    permission_classes = []

    # Lista serializerii dla danech typów zapytań
    serializer_classes = {
        'GET': UsersActivatedSerializer,
    }

    # Jeżeli danego zapytania nie ma na liście serializer_classes to wykorzystany będzie domyślny
    default_serializer_class = UsersActivatedSerializer
    
    # Metoda przygotowuje nam dane do zwrócenia - my potrzebujemy informacji o jednym użytkowniku
    def get_queryset(self):
        # Zwracamy uzytkownika
        activation = UserActivate.objects.filter(activate_code=self.request.query_params.get('code'))
        user = get_user_model().objects.none()
        if(activation):
            user = [a.user_id for a in activation]
            # Aktywujemy konto użytkownika
            user[0].is_active = True
            user[0].save()
            # Usuwamy kod aktywacyjny
            activation.delete()
        return user

    # Metoda wybiera z jakiego serializera będziemy korzystać
    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.default_serializer_class)

#
# CHILD
#

# Widok tworzenia profilu dziecka
class UserCreateChildViewSet(viewsets.ModelViewSet):
    queryset = Child.objects.none()

    # Wymagane podanie tokena w nagłowku zapytania
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    

    # Lista serializerii dla danech typów zapytań
    serializer_classes = {
        'POST': UserCreateChildSerializer,
    }

    # Jeżeli danego zapytania nie ma na liście serializer_classes to wykorzystany będzie domyślny
    default_serializer_class = UserCreateChildSerializer
    
    # Metoda wybiera z jakiego serializera będziemy korzystać
    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.default_serializer_class)


#
# ACTIVITIES
#

# Widok do pobrania informacji powiazanych z użytkownikiem
class UsersGetActivitiesViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.none()

    # Wymagane podanie tokena w nagłowku zapytania
    authentication_classes = []
    permission_classes = []

    # Lista serializerii dla danech typów zapytań
    serializer_classes = {
        'GET': UsersGetActivities,
    }

    # Jeżeli danego zapytania nie ma na liście serializer_classes to wykorzystany będzie domyślny
    default_serializer_class = UsersGetActivities
    
    # Metoda przygotowuje nam dane do zwrócenia
    def get_queryset(self):
        # Zwracamy uzytkownika
        activities = Activity.objects.filter()
        for a in activities:
            setattr(a,'children','children')
            setattr(a,'employee','employee')
        return activities


    # Metoda wybiera z jakiego serializera będziemy korzystać
    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.default_serializer_class)

#  ___   _   _   ____    _____   ___   _____   _   _   _____   ___    ___    _   _ 
# |_ _| | \ | | / ___|  |_   _| |_ _| |_   _| | | | | |_   _| |_ _|  / _ \  | \ | |
#  | |  |  \| | \___ \    | |    | |    | |   | | | |   | |    | |  | | | | |  \| |
#  | |  | |\  |  ___) |   | |    | |    | |   | |_| |   | |    | |  | |_| | | |\  |
# |___| |_| \_| |____/    |_|   |___|   |_|    \___/    |_|   |___|  \___/  |_| \_|
#                                                                                  

# Widok rejestrowania/tworzenia instytucji
class InstitutionRegisterViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.none()

    # Lista serializerii dla danech typów zapytań
    serializer_classes = {
        'POST': InstitutionRegisterSerializer,
    }

    # Jeżeli danego zapytania nie ma na liście serializer_classes to wykorzystany będzie domyślny
    default_serializer_class = InstitutionRegisterSerializer

    # Metoda wybiera z jakiego serializera będziemy korzystać
    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.default_serializer_class)


# Widok do sprzwdzenia czy nazwa instytucji jest jeszcze dostępna
class InstitutionNameExistViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.none()

    # Lista serializerii dla danech typów zapytań
    serializer_classes = {
        'GET': InstitutionNameExistSerializer,
    }

    # Jeżeli danego zapytania nie ma na liście serializer_classes to wykorzystany będzie domyślny
    default_serializer_class = InstitutionNameExistSerializer

    def get_queryset(self):
        institution_user = get_user_model().objects.filter(username=str(self.request.query_params.get('name')))
        identificator = [iu for iu in institution_user]
        return identificator

    # Metoda wybiera z jakiego serializera będziemy korzystać
    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.default_serializer_class)

#  _____   __  __   ____    _        ___   __   __  _____   _____ 
# | ____| |  \/  | |  _ \  | |      / _ \  \ \ / / | ____| | ____|
# |  _|   | |\/| | | |_) | | |     | | | |  \ V /  |  _|   |  _|  
# | |___  | |  | | |  __/  | |___  | |_| |   | |   | |___  | |___ 
# |_____| |_|  |_| |_|     |_____|  \___/    |_|   |_____| |_____|
#  

# Widok rejestrowania/tworzenia profilu pracownika
class EmployeeRegisterViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.none()
    
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    # Lista serializerii dla danech typów zapytań
    serializer_classes = {
        'POST': EmployeeRegisterSerializer,
    }

    # Jeżeli danego zapytania nie ma na liście serializer_classes to wykorzystany będzie domyślny
    default_serializer_class = EmployeeRegisterSerializer
    
    # Metoda wybiera z jakiego serializera będziemy korzystać
    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.default_serializer_class)
