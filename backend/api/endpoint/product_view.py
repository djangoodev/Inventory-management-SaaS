from rest_framework import generics
from api.models import Product, Company, VariationType, VariationTypeAttribute, Variation, CompanyStuff
from api.serializers import ProductSerializer, VariationSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
import json
from socketio_app.views import sio

class ProductView(generics.ListCreateAPIView):
    """
    Api for create and list products
    """
    serializer_class = ProductSerializer

    def get_queryset(self):
        user = self.request.user
        company_stuff = CompanyStuff.objects.filter(stuff=user, role=0).first()
        queryset = Product.objects.filter(company=company_stuff.company)
        return queryset

    def create(self, request, *args, **kwargs):
        user = self.request.user
        name = self.request.data['name']
        description = self.request.data['description']
        sku = self.request.data['sku']
        price = self.request.data['price']
        company_id = self.request.data['company']
        image = self.request.data['image']
        company = Company.objects.filter(id=company_id).first()
        product = Product.objects.create(name=name, description=description, image=image, sku=sku, price=price, company=company)
        produc_serializer = ProductSerializer(product)

        variation_types = self.request.data['variation_type']

        for variation_type in variation_types:
            variation_type_entry = VariationType.objects.create(product=product, type=variation_type['name'])

            variation_type_attributes = variation_type['value']
            for variation_type_attribute in variation_type_attributes:
                VariationTypeAttribute.objects.create(variation_type=variation_type_entry, attribute=variation_type_attribute)

        variations = self.request.data['variations']
        for variation in variations:
            if "sku" in variation:
                sku = variation["sku"]
            else:
                sku = ''

            if "image" in variation:
                image = variation["image"]
            else:
                image = ''

            if "price" in variation:
                price = variation["price"]
            else:
                price = ''

            if "barcode" in variation:
                barcode = variation["barcode"]
            else:
                barcode = ''

            Variation.objects.create(product=product, title=variation['title'], sku=sku, barcode=barcode,
                                     image=image, price=price)
            print("socket emited")
            sio.emit('create_product', {
                'data': {
                    'state': 'created',
                    'product': produc_serializer.data,
                    'user': {
                        'email': user.email,
                        'id': user.id
                    }
                }
            }, namespace='/test')
            print("socket closed")
        return Response(produc_serializer.data)


class ProductUpdateView(generics.UpdateAPIView):
    """
    Api for updating product
    """

    serializer_class = ProductSerializer

    def get_queryset(self):
        product_id = self.kwargs['pk']
        queryset = Product.objects.filter(pk=product_id)
        variations = self.request.data['variations']
        for variation in variations:
            old_variation = Variation.objects.filter(id=variation['id']).first()

            if variation["sku"]:
                sku = variation["sku"]
            else:
                sku = old_variation.sku

            if variation["image"]:
                image = variation["image"]
            else:
                image = old_variation.image

            if variation["price"]:
                price = variation["price"]
            else:
                price = old_variation.price

            if variation["barcode"]:
                barcode = variation["barcode"]
            else:
                barcode = old_variation.barcode

            Variation.objects.update(title=old_variation.title, sku=sku, barcode=barcode,
                                     image=image, price=price)

        return queryset


class ProductDeleteView(generics.DestroyAPIView):
    """
    Api for deleting product
    """

    serializer_class = ProductSerializer

    def get_queryset(self):
        product_id = self.kwargs['pk']
        queryset = Product.objects.filter(pk=product_id)
        return queryset


class SearchProductView(APIView):
    """
    get product by name

    """
    def get(self, request, *args, **kwargs):
        response = []
        filter = request.query_params['filter']
        filter_json = json.loads(filter)
        user = self.request.user
        company_stuff = CompanyStuff.objects.filter(stuff=user, role=0).first()
        products = Product.objects.filter(Q(name__icontains=filter_json['arg']), company=company_stuff.company).all()
        for product in products:
            variations = Variation.objects.filter(product=product).all()
            variations_serializer = VariationSerializer(variations, many=True)
            response = response + variations_serializer.data

        return Response(response)


class VariationView(generics.ListCreateAPIView):
    """
    Api for create and list variations
    """
    serializer_class = VariationSerializer

    def get_queryset(self):
        product_id = self.kwargs['pk']
        queryset = Variation.objects.filter(product=product_id)
        return queryset
