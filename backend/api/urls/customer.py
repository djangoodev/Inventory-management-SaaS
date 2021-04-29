from django.urls import path, include, re_path
from api.endpoint import customer_view

urlpatterns = [
    re_path(r'entity', customer_view.CustomerView.as_view()),
    re_path(r'search', customer_view.SearchCustomerView.as_view()),
    re_path(r'(?P<pk>\d+)/update', customer_view.CustomerUpdateView.as_view()),
    re_path(r'(?P<pk>\d+)/delete', customer_view.CustomerDeleteView.as_view()),
]

