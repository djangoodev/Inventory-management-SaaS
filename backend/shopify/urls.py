from django.urls import path, include, re_path
from shopify import views

urlpatterns = [
    re_path(r'order', views.WebHook.as_view()),
]

