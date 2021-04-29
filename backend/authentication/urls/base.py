from django.conf.urls import url, include
from django.contrib.auth import get_user_model

from authentication import views, twilio_view

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('users', views.UserViewSet)

User = get_user_model()

urlpatterns = [
    url(r'^me/?$', views.UserView.as_view(), name='user'),
    url(
        r'^users/create/?$',
        views.UserCreateView.as_view(),
        name='user-create'
    ),
    url(
        r'^users/check/store/?',
        views.CheckStoreView.as_view(),
        name='check-store'),
    url(
        r'^users/jwt/create/?',
        views.ObtainJwtToken.as_view(),
        name='jwt-create'),
    url(
        r'^users/update/?$',
        views.UserUpdateView.as_view(),
        name='user-update'
    ),
    url(
        r'^users/sms/?$',
        twilio_view.PhoneSMSSendView.as_view(),
        name='user-update'
    ),
    url(
        r'^users/sms/verify/?$',
        twilio_view.PhoneVerifyView.as_view(),
        name='user-update'
    ),
    url(
        r'^profile/update/(?P<pk>\d+)/?$',
        views.UserProfileUpdateView.as_view(),
        name='profile-update'
    ),
    url(
        r'^profile/resetpwd/?$',
        views.UserPwdResetView.as_view(),
        name='profile-update'
    ),
    url(
        r'^users/delete/?$',
        views.UserDeleteView.as_view(),
        name='user-delete'
    ),
    url(
        r'^users/activate/?$',
        views.ActivationView.as_view(),
        name='user-activate'
    ),
    url(
        r'^{0}/?$'.format(User.USERNAME_FIELD),
        views.SetUsernameView.as_view(),
        name='set_username'
    ),
    url(r'^password/?$', views.SetPasswordView.as_view(), name='set_password'),
    url(
        r'^password/reset/?$',
        views.PasswordResetView.as_view(),
        name='password_reset'
    ),
    url(
        r'^password/reset/confirm/?$',
        views.PasswordResetConfirmView.as_view(),
        name='password_reset_confirm'
    ),
    url(
        r'company/entity/$',
        views.CompanyListView.as_view()
    ),
    url(
        r'company/update/(?P<id>\d+)/?$',
        views.CompanyUpdateView.as_view()
    ),
    url(
        r'security/questions?$',
        views.SecurityQuestionView.as_view()
    ),
    url(
        r'security/answer$',
        views.SecurityAnswerView.as_view()
    ),
    url(
        r'security/confirm$',
        views.SecurityConfirmView.as_view()
    ),
    url(
        r'location/?$',
        views.CompanyUpdateView.as_view()
    ),
    url(r'^$', views.RootView.as_view(), name='root'),
    url(r'^', include(router.urls)),
]
