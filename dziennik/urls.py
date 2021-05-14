"""dziennik URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token

from . import views

router = routers.DefaultRouter()
# User
router.register('users', views.UsersViewSet)
router.register('users-register', views.UserRegisterViewSet)
router.register('users-activated', views.UsersActivatedViewSet)
router.register('users-activation', views.UsersActivationAccountViewSet)
router.register('users-activities', views.UsersGetActivitiesViewSet)
router.register('users-create-child', views.UserCreateChildViewSet)
router.register('users-delete-child', views.UserDeleteChildViewSet)
router.register('users-update-child', views.UserUpdateChildViewSet)
router.register('users-children', views.UserChildrenViewSet)
# Institution
router.register('institutions', views.InstitutionsViewSet)
router.register('institutions-register', views.InstitutionRegisterViewSet)
router.register('institutions-exist', views.InstitutionNameExistViewSet)
router.register('institutions-assign-child', views.InstitutionAssignChildViewSet)
# Employee
router.register('employee-register', views.EmployeeRegisterViewSet)

urlpatterns = [  
    path('panel/admin/', include('smuggler.urls')),
    path('panel/admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('auth/', obtain_auth_token)
]
