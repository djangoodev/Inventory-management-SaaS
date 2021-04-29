from rest_framework import generics, permissions
from api_product.models import Product
from api_product.serializers import ProductSerializer, EditProductSerializer


class ProductView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.filter(added_by=self.request.user).order_by('-id')
        return queryset

    def perform_create(self, serializer):
        serializer.save(added_by=self.request.user)


class GetProductView(generics.ListAPIView):
    serializer_class = EditProductSerializer

    def get_queryset(self):
        pk = self.kwargs['id']
        queryset = Product.objects.filter(id=pk, added_by=self.request.user)
        return queryset


class UpdateProductView(generics.UpdateAPIView):
    serializer_class = EditProductSerializer

    def get_queryset(self):
        pk = self.kwargs['pk']
        queryset = Product.objects.filter(id=pk, added_by=self.request.user)
        return queryset


class DeleteProductView(generics.DestroyAPIView):
    serializer_class = EditProductSerializer

    def get_queryset(self):
        pk = self.kwargs['pk']
        queryset = Product.objects.filter(id=pk, added_by=self.request.user)
        return queryset
