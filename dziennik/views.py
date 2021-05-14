from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.core.mail import EmailMessage
from rest_framework.authtoken.models import Token
from rest_framework import viewsets, permissions, exceptions
from . import serializers, models
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
        'POST': serializers.UserRegisterSerializer,
    }

    # Jeżeli danego zapytania nie ma na liście serializer_classes to wykorzystany będzie domyślny
    default_serializer_class = serializers.UserRegisterSerializer
    
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
        'GET': serializers.UsersSerializer,
    }

    # Jeżeli danego zapytania nie ma na liście serializer_classes to wykorzystany będzie domyślny
    default_serializer_class = serializers.UsersSerializer
    
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
        'GET': serializers.UsersActivatedSerializer,
    }

    # Jeżeli danego zapytania nie ma na liście serializer_classes to wykorzystany będzie domyślny
    default_serializer_class = serializers.UsersActivatedSerializer
    
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
        'GET': serializers.UsersActivatedSerializer,
    }

    # Jeżeli danego zapytania nie ma na liście serializer_classes to wykorzystany będzie domyślny
    default_serializer_class = serializers.UsersActivatedSerializer
    
    # Metoda przygotowuje nam dane do zwrócenia - my potrzebujemy informacji o jednym użytkowniku
    def get_queryset(self):
        # Zwracamy uzytkownika
        activation = models.UserActivate.objects.filter(activate_code=self.request.query_params.get('code'))
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
    queryset = models.Child.objects.none()

    # Wymagane podanie tokena w nagłowku zapytania
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    

    # Lista serializerii dla danech typów zapytań
    serializer_classes = {
        'POST': serializers.UserCreateChildSerializer,
    }

    # Jeżeli danego zapytania nie ma na liście serializer_classes to wykorzystany będzie domyślny
    default_serializer_class = serializers.UserCreateChildSerializer
    
    # Metoda wybiera z jakiego serializera będziemy korzystać
    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.default_serializer_class)

# Widok usuwania profilu dziecka
class UserDeleteChildViewSet(viewsets.ModelViewSet):
    queryset = models.Child.objects.none()

    # Wymagane podanie tokena w nagłowku zapytania
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    

    # Lista serializerii dla danech typów zapytań
    serializer_classes = {
        'get': serializers.UserChildDeleteSerializer,
    }

    # Jeżeli danego zapytania nie ma na liście serializer_classes to wykorzystany będzie domyślny
    default_serializer_class = serializers.UserChildDeleteSerializer
    
    
    # Metoda przygotowuje nam dane do zwrócenia - pusty [] gdy usuwamy dane dziecko
    def get_queryset(self):
        # Usuwamy dziecko
        child = models.Child.objects.filter(id=int(self.request.query_params.get('child')))
        _child = child
        child.delete()
        return _child

    # Metoda wybiera z jakiego serializera będziemy korzystać
    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.default_serializer_class)

# Widok aktualizowania profilu dziecka
class UserUpdateChildViewSet(viewsets.ModelViewSet):
    queryset = models.Child.objects.none()

    # Wymagane podanie tokena w nagłowku zapytania
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    

    # Lista serializerii dla danech typów zapytań
    serializer_classes = {
        'post': serializers.UserChildUpdateSerializer,
    }

    # Jeżeli danego zapytania nie ma na liście serializer_classes to wykorzystany będzie domyślny
    default_serializer_class = serializers.UserChildUpdateSerializer

    # Metoda wybiera z jakiego serializera będziemy korzystać
    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.default_serializer_class)

# Widok listy dzieci + ich przypisania do instytucji
class UserChildrenViewSet(viewsets.ModelViewSet):
    queryset = models.Child.objects.none()

    # Wymagane podanie tokena w nagłowku zapytania
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    

    # Lista serializerii dla danech typów zapytań
    serializer_classes = {
        'GET': serializers.UserChildrenSerializer,
    }

    # Jeżeli danego zapytania nie ma na liście serializer_classes to wykorzystany będzie domyślny
    default_serializer_class = serializers.UserChildrenSerializer
    
    # Metoda przygotowuje nam dane do zwrócenia - my potrzebujemy informacji o dzieciach użytkownika oraz ich przynalezności do instytucji
    def get_queryset(self):
        # Zwracamy uzytkownika
        children = models.Child.objects.filter(parent_id=int(self.request.query_params.get('parent')))
        for child in children:
            assignments = models.Assignment.objects.filter(child_id=child)
            _assigments = dict()
            for assignment in assignments:
                _assigments[str(assignment.id)]=dict()
                _assigments[str(assignment.id)]["name"] = assignment.institution_id.user_id.username
                _assigments[str(assignment.id)]["status"] = assignment.status
            setattr(child,'assigments',_assigments)
        return children

    # Metoda wybiera z jakiego serializera będziemy korzystać
    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.default_serializer_class)

#
# ACTIVITIES
#

# Widok do pobrania informacji powiazanych z użytkownikiem
class UsersGetActivitiesViewSet(viewsets.ModelViewSet):
    queryset = models.Activity.objects.none()

    # Wymagane podanie tokena w nagłowku zapytania
    authentication_classes = []
    permission_classes = []

    # Lista serializerii dla danech typów zapytań
    serializer_classes = {
        'GET': serializers.UsersGetActivities,
    }

    # Jeżeli danego zapytania nie ma na liście serializer_classes to wykorzystany będzie domyślny
    default_serializer_class = serializers.UsersGetActivities
    
    # Metoda przygotowuje nam dane do zwrócenia
    def get_queryset(self):
        # Zwracamy uzytkownika
        activities = models.Activity.objects.filter()
        for activity in activities:
            setattr(activity,'children','children')
            setattr(activity,'employee','employee')
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

# Zwraca listę instytucji
class InstitutionsViewSet(viewsets.ModelViewSet):
    queryset = models.Institution.objects.all()

    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    # Lista serializerii dla danech typów zapytań
    serializer_classes = {
        'GET': serializers.InstitutionsSerializer,
    }

    # Jeżeli danego zapytania nie ma na liście serializer_classes to wykorzystany będzie domyślny
    default_serializer_class = serializers.InstitutionsSerializer

    # Dodanie nazwy do zwracanych instytucji
    def get_queryset(self):
        institutions = models.Institution.objects.all()
        for institution in institutions:
            name = institution.user_id.username
            setattr(institution, 'name', name)
        return institutions

    # Metoda wybiera z jakiego serializera będziemy korzystać
    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.default_serializer_class)

# Widok rejestrowania/tworzenia instytucji
class InstitutionRegisterViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.none()

    # Lista serializerii dla danech typów zapytań
    serializer_classes = {
        'POST': serializers.InstitutionRegisterSerializer,
    }

    # Jeżeli danego zapytania nie ma na liście serializer_classes to wykorzystany będzie domyślny
    default_serializer_class = serializers.InstitutionRegisterSerializer

    # Metoda wybiera z jakiego serializera będziemy korzystać
    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.default_serializer_class)


# Widok do sprzwdzenia czy nazwa instytucji jest jeszcze dostępna
class InstitutionNameExistViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.none()

    # Lista serializerii dla danech typów zapytań
    serializer_classes = {
        'GET': serializers.InstitutionNameExistSerializer,
    }

    # Jeżeli danego zapytania nie ma na liście serializer_classes to wykorzystany będzie domyślny
    default_serializer_class = serializers.InstitutionNameExistSerializer

    def get_queryset(self):
        institution_user = get_user_model().objects.filter(username=str(self.request.query_params.get('name')))
        identificator = [iu for iu in institution_user]
        return identificator

    # Metoda wybiera z jakiego serializera będziemy korzystać
    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.default_serializer_class)


#
# ASSIGNMENT
#

# Widok tworzenia przypisania do instytucji
class InstitutionAssignChildViewSet(viewsets.ModelViewSet):
    queryset = models.Assignment.objects.none()

    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    # Lista serializerii dla danech typów zapytań
    serializer_classes = {
        'POST': serializers.InstitutionAssignChildSerializer,
    }

    # Jeżeli danego zapytania nie ma na liście serializer_classes to wykorzystany będzie domyślny
    default_serializer_class = serializers.InstitutionAssignChildSerializer
    
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
    queryset = models.Employee.objects.none()
    
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    # Lista serializerii dla danech typów zapytań
    serializer_classes = {
        'POST': serializers.EmployeeRegisterSerializer,
    }

    # Jeżeli danego zapytania nie ma na liście serializer_classes to wykorzystany będzie domyślny
    default_serializer_class = serializers.EmployeeRegisterSerializer
    
    # Metoda wybiera z jakiego serializera będziemy korzystać
    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.default_serializer_class)
