from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives
from email.mime.image import MIMEImage
from django.template.loader import render_to_string
from rest_framework.authtoken.models import Token
from rest_framework import serializers
from .models import UserActivate
from .settings import STATIC_ROOT

import random
import string
import os
import mimetypes
mimetypes.add_type("image/svg+xml", ".svg", True)

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        # Dane jakie potrzebujemy do zarejestrowania użytkownika
        fields = ['username', 'password', 'first_name', 'last_name', 'email', 'phone', 'role']
        extra_kwargs = {
            'username': {'write_only': True, 'required': True},
            'password': {'write_only': True, 'required': True},
            'first_name': {'write_only': True, 'required': True},
            'last_name': {'write_only': True, 'required': True},
            'phone': {'write_only': True, 'required': False},
            'email': {'write_only': True, 'required': True},
            'role': {'write_only': True, 'required': False}
        }

    # Rejestrowanie użytkownika
    def create(self, validated_data):
        # Generowanie kodu aktywacyjnego
        # 64 znaki (małe i duże litary oraz cyfry)
        generated_activate_key_size = 64
        generated_activate_key_chars = string.ascii_letters + string.digits
        generated_activate_key = ''.join(random.choice(generated_activate_key_chars) for _ in range(generated_activate_key_size))

        # Tworzenie nowego użytkownika
        user = get_user_model().objects.create_user(**validated_data)
        # Tworzenie aktywacji uprzednio stworzonego użytkownika
        UserActivate.objects.create(user_id=user,activate_code=generated_activate_key)
        # Stworzenie tokenu autoryzujacego dla uzytkownika
        Token.objects.create(user=user)

        # Wysyłanie email'a
        subject = 'Aktywacja konta w serwisie Dziennik.'
        message = render_to_string('mail/activate.html', {
            'user': user,
            'activate_link': 'http://localhost:3000/activate/' + generated_activate_key
        })
        email = EmailMultiAlternatives( subject, message, from_email='Dziennik', to=[user.email])
        email.mixed_subtype = 'related'
        email.attach_alternative(message, "text/html")
        email.send()

        return user

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        # Dane jakie potrzebujemy pobrać o uzytkowniku
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'role']