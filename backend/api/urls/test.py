from django.urls import path, include, re_path
from api.endpoint import test_view

urlpatterns = [
    re_path(r'socket', test_view.TestView.as_view()),
]

