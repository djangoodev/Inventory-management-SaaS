from rest_framework import generics
from api.models import Order
from api.serializers import OrderSerializer
from rest_framework.views import APIView
from rest_framework.response import Response


class OrderView(generics.ListCreateAPIView):
    """
    Api for creating order
    2019/03/18
    Created by Mikhail Beliy
    """

    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Order.objects.filter(owner=user.id)
        return queryset


class GetOrder(generics.ListCreateAPIView):
    """
    Api for get order
    2019/03/18
    Created by Mikhail Beliy
    """

    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        order_id = self.kwargs['order_id']
        queryset = Order.objects.filter(id=order_id, owner=user.id)
        return queryset


class GetAmount(APIView):
    """
    Api for get amount
    2019/03/18
    Created by Mikhail Beliy
    """

    def get(self, request, *args, **kwargs):
        user = self.request.user
        amount = Order.objects.filter(owner=user.id).count()
        return Response(amount)


class OrderUpdateView(generics.UpdateAPIView):
    """
    Api for updating customer
    """

    serializer_class = OrderSerializer

    def get_queryset(self):
        order_id = self.kwargs['pk']
        queryset = Order.objects.filter(pk=order_id)
        return queryset


class OrderDeleteView(generics.DestroyAPIView):
    """
    Api for deleting customer
    """

    serializer_class = OrderSerializer

    def get_queryset(self):
        order_id = self.kwargs['pk']
        queryset = Order.objects.filter(pk=order_id)
        return queryset
