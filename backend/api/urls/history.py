from django.urls import path, include, re_path
from api.endpoint import history_view

urlpatterns = [
    re_path(r'entity', history_view.HistoryView.as_view()),
    re_path(r'list', history_view.HistoryListView.as_view()),
]

