from rest_framework import generics
from api.models import Customer
from rest_framework.response import Response
from api.serializers import CustomerSerializer
from authentication.serializers import UserSerializer
from authentication.models import User
from rest_framework.views import APIView
from django.db.models import Q
import json
from socketio_app.views import sio


class CustomerView(generics.ListCreateAPIView):
    """
    Api for create and list customers
    """
    serializer_class = CustomerSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Customer.objects.filter(owner=user.id)
        return queryset

    def post(self, request, *args, **kwargs):
        sio.emit('my response', {'data': "fdasfasdfasdfsd"}, namespace='/test')
        return self.create(request, *args, **kwargs)


class CustomerUpdateView(generics.UpdateAPIView):
    """
    Api for updating customer
    """

    serializer_class = CustomerSerializer

    def get_queryset(self):
        customer_id = self.kwargs['pk']
        queryset = Customer.objects.filter(pk=customer_id)
        return queryset


class CustomerDeleteView(generics.DestroyAPIView):
    """
    Api for deleting customer
    """

    serializer_class = CustomerSerializer

    def get_queryset(self):
        customer_id = self.kwargs['pk']
        queryset = Customer.objects.filter(pk=customer_id)
        return queryset


class SearchCustomerView(APIView):
    """
    search user by username or email

    """
    def get(self, request, *args, **kwargs):
        user_id = self.request.user.id
        filter = request.query_params['filter']
        filter_json = json.loads(filter)
        customers = User.objects.filter(Q(email__icontains=filter_json['arg'])).exclude(id=user_id).all()
        customers_serializer = UserSerializer(customers, many=True)
        return Response(customers_serializer.data)
