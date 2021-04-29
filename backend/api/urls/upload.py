from django.urls import path, include, re_path
from api.endpoint import upload

urlpatterns = [
    re_path(r'image', upload.UploadImage.as_view()),
]

