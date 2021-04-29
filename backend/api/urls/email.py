from django.urls import path, include, re_path
from api.endpoint import email_view

urlpatterns = [
    re_path(r'invitation', email_view.InvitationView.as_view()),
]

