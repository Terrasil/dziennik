from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group
from .forms import CustomUserChangeForm, CustomUserCreationForm
from .models import CustomUser, Institution, Employee, Activity, Child, Assignment, Attendance

class UserAdminConfig(UserAdmin):
    model = CustomUser
    search_fields = ('email', 'username', 'first_name', 'last_name',)
    list_filter = ('email', 'username', 'first_name', 'last_name', 'is_active', 'is_staff')
    ordering = ('-start_date',)
    list_display = ('email', 'username', 'first_name', 'last_name', 'role',
                    'is_active', 'is_staff')
    fieldsets = (
        (None, {'fields': ('email', 'username', 'first_name', 'last_name',)}),
        ('Permissions', {'fields': ('role',  'is_staff', 'is_active')}),
        ('Personal', {'fields': ('about',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'first_name', 'last_name', 'password1', 'password2', 'is_active', 'is_staff')}
         ),
    )


class ExampleAdmin(admin.ModelAdmin):
    change_list_template = 'smuggler/change_list.html'

admin.site.register(CustomUser, UserAdminConfig)
admin.site.register(Institution)
admin.site.register(Employee)
admin.site.register(Activity)
admin.site.register(Child)
admin.site.register(Assignment)
admin.site.register(Attendance)

# Nie korzystamy z grup
admin.site.unregister(Group)