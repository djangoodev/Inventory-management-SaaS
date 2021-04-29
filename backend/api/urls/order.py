from django.urls import path, include, re_path
from api.endpoint import order_view

urlpatterns = [
    re_path(r'entity', order_view.OrderView.as_view()),
    re_path(r'(?P<order_id>\d+)/edit', order_view.GetOrder.as_view()),
    re_path(r'(?P<pk>\d+)/update', order_view.OrderUpdateView.as_view()),
    re_path(r'(?P<pk>\d+)/delete', order_view.OrderDeleteView.as_view()),
    re_path(r'amount', order_view.GetAmount.as_view()),
]

