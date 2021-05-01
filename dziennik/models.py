from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class CustomAccountManager(BaseUserManager):
    def create_superuser(self, email, username, first_name, last_name, password, **other_fields):
        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser', True)
        other_fields.setdefault('is_active', True)

        if other_fields.get('is_staff') is not True:
            raise ValueError(
                'Superuser must be assigned to is_staff=True.')
        if other_fields.get('is_superuser') is not True:
            raise ValueError(
                'Superuser must be assigned to is_superuser=True.')
        return self.create_user(email, username, first_name, last_name, password, **other_fields)
    
    def create_user(self, email, username, first_name, last_name, password, **other_fields):
        if not email:
            raise ValueError(_('You must provide an email address'))
        
        email = self.normalize_email(email)
        user = self.model(email=email, username=username,
                          first_name=first_name, last_name=last_name,
                          **other_fields)
        user.set_password(password)
        user.save()
        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)
    username = models.CharField(max_length=150, unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    start_date = models.DateTimeField(default=timezone.now)
    role = models.CharField(max_length=150)
    about = models.TextField(_(
        'about'), max_length=500, blank=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)

    objects = CustomAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"



class Institution(models.Model):
    user_id = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    email = models.CharField(max_length=200)
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=200)
    profile = models.CharField(max_length=200)
    creation_date = models.DateTimeField(default=timezone.now())

    def __str__(self):
        return self.name

    def publish(self):
        self.save()
        
    class Meta:
        ordering = ('name',)
        verbose_name_plural = "Institutions"

class Employee(models.Model):
    institution_id = models.ForeignKey('Institution', on_delete=models.CASCADE)
    user_id = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    email = models.CharField(max_length=200)
    specialization = models.CharField(max_length = 20,default=True)
    active = models.BooleanField(default=False)
    first_name = models.CharField(max_length = 20,default=True)
    last_name = models.CharField(max_length = 20,default=True)
    #phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Telefon musi być podany w formacie: '999999999'.")
    #phone = models.CharField(validators=[phone_regex], max_length=17, blank=True) 
    creation_date = models.DateTimeField(default=timezone.now())

    def __str__(self):
        return self.first_name +" "+ self.last_name

    def publish(self):
        self.save()

    class Meta:
        verbose_name_plural = "Employees"

class Activity(models.Model):
    isntitution_id = models.ForeignKey('Institution', on_delete=models.CASCADE)
    employee_id = models.ForeignKey('Employee', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    date = models.DateField(blank=True, default=timezone.now)
    start_time = models.TimeField(blank=True, default=timezone.now)
    end_time = models.TimeField(blank=True, default=timezone.now)
    periodicity = models.IntegerField(null=True, default=0)
    finished = models.BooleanField(default=False)
    remind_employee = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    def publish(self):
        self.save()

    class Meta:
        verbose_name_plural = "Activities"

class Child(models.Model):
    parent_id = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    first_name = models.CharField(max_length = 20,default=True)
    last_name = models.CharField(max_length = 20,default=True)
    age = models.IntegerField(default=0)

    def __str__(self):
        return self.first_name +" "+ self.last_name

    def publish(self):
        self.save()

    class Meta:
        verbose_name_plural = "Children"

class Assignment(models.Model):
    child_id = models.ForeignKey('Child', on_delete=models.CASCADE)
    institution_id = models.ForeignKey('Institution', on_delete=models.CASCADE)
    status = models.CharField(max_length=32,default='Pending')

    def __str__(self):
        return str(self.child_id)+" -> "+str(self.institution_id)+" ["+str(self.status)+"]"

    def publish(self):
        self.save()

    class Meta:
        verbose_name_plural = "Assignments"
        
class Attendance(models.Model):
    child_id = models.ForeignKey('Child', on_delete=models.CASCADE)
    activity_id = models.ForeignKey('Activity', on_delete=models.CASCADE)
    presence = models.IntegerField(default=False)
    remind_parent = models.BooleanField(default=False)

    def __str__(self):
            return str(self.child_id)+" -> "+str(self.activity_id)+" ["+str(self.presence)+"]"


    def publish(self):
        self.save()

    class Meta:
        verbose_name_plural = "Attendances"