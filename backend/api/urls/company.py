from django.urls import path, include, re_path
from api.endpoint import company_view

urlpatterns = [
    re_path(r'entity/(?P<company_id>\d+)/stuff', company_view.CompanyView.as_view()),
]

