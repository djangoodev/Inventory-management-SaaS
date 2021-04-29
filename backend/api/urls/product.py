from django.urls import path, include, re_path
from api.endpoint import product_view

urlpatterns = [
    re_path(r'entity', product_view.ProductView.as_view()),
    re_path(r'search', product_view.SearchProductView.as_view()),
    re_path(r'(?P<pk>\d+)/update', product_view.ProductUpdateView.as_view()),
    re_path(r'(?P<pk>\d+)/delete', product_view.ProductDeleteView.as_view()),
    re_path(r'(?P<pk>\d+)/variations', product_view.VariationView.as_view()),

]

