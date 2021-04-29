from django.urls import re_path
from api_category.endpoint import category

urlpatterns = [
    re_path(r'top', category.TopCategoryView.as_view()),
    re_path(r'category', category.CategoryView.as_view()),
    re_path(r'parallel', category.CategoryParallelView.as_view()),
    re_path(r'create', category.CategoryParallelView.as_view()),
    re_path(r'(?P<pk>\d+)/update', category.CategoryUpdateView.as_view()),
    re_path(r'(?P<pk>\d+)/delete', category.CategoryDeleteView.as_view()),
]
