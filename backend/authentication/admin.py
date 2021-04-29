from django.contrib import admin
from authentication.models import User, History, Company, CompanyStuff, SecurityQuestion, SecurityAnswer


class UserAdmin(admin.ModelAdmin):
    model = User
    list_display = ['id', 'email', 'surname', 'name', 'phone', 'phone_verified',  'country', 'state',
                    'city', 'address', 'postal_code', 'avatar', 'birthday', 'gender', 'is_active', 'status']


admin.site.register(User, UserAdmin)


class HistoryAdmin(admin.ModelAdmin):
    model = History
    list_display = ['id', 'user', 'ip_address', 'browser_info', 'location', 'created_at', 'updated_at']


admin.site.register(History, HistoryAdmin)


class CompanyAdmin(admin.ModelAdmin):
    model = Company
    list_display = ['id', 'name', 'phone', 'phone_verified', 'country', 'state',  'city', 'address', 'postal_code',
                    'longitude', 'latitude']


admin.site.register(Company, CompanyAdmin)


class CompanyStuffAdmin(admin.ModelAdmin):
    model = CompanyStuff
    list_display = ['id', 'company', 'stuff', 'role']


admin.site.register(CompanyStuff, CompanyStuffAdmin)


class SecurityQuestionAdmin(admin.ModelAdmin):
    model = SecurityQuestion
    list_display = ['id', 'question']


admin.site.register(SecurityQuestion, SecurityQuestionAdmin)


class SecurityAnswerAdmin(admin.ModelAdmin):
    model = SecurityAnswer
    list_display = ['id', 'question', 'user', 'answer']


admin.site.register(SecurityAnswer, SecurityAnswerAdmin)

