from rest_framework import generics, permissions
from api_category.models import Category
from api_category.serializers import CategorySerializer, StandardCategorySerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import Http404
from rest_framework import status


class TopCategoryView(generics.ListCreateAPIView):
    queryset = Category.objects.filter(parent=0).all()
    serializer_class = CategorySerializer


class CategoryView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryParallelView(generics.ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Category.objects.all()
    serializer_class = StandardCategorySerializer


class CategoryUpdateView(generics.UpdateAPIView):

    serializer_class = StandardCategorySerializer

    def get_queryset(self):
        category_id = self.kwargs['pk']
        queryset = Category.objects.filter(pk=category_id)
        return queryset


class CategoryDeleteView(APIView):

    def get_object(self, pk):
        try:
            return Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            raise Http404

    def delete(self, request, pk, format=None):
        category = self.get_object(pk)
        self.deleteChildren(category)
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def deleteChildren(self, parent):
        children = Category.objects.filter(parent=parent.id).all()
        for child in children:
            check_children = Category.objects.filter(parent=child.id).first()
            if check_children:
                self.deleteChildren(child)
            child.delete()
