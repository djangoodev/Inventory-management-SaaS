from rest_framework import serializers
from api.models import Product, VariationType, VariationTypeAttribute, Variation


class ProductSerializer(serializers.ModelSerializer):
    variation_type = serializers.SerializerMethodField('get_variation_types')

    def get_variation_types(self, product):
        variation_types = VariationType.objects.filter(product=product.id).all()
        if variation_types:
            serial_variation_types = VariationTypeSerializer(variation_types, many=True)
            return serial_variation_types.data
        else:
            return None

    # variations = serializers.SerializerMethodField('get_variation')
    # def get_variation(self, product):
    #     variation = Variation.objects.filter(product_id=product.id).all()
    #     if variation:
    #         serial_variations = VariationSerializer(variation, many=True)
    #         return serial_variations.data
    #     else:
    #         return None

    class Meta:
        model = Product
        fields = ('id', 'name', 'description', 'image', 'is_active', 'company_id', 'price', 'sku', 'variation_type')


class VariationTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VariationType
        fields = '__all__'


class VariationTypeAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VariationTypeAttribute
        fields = '__all__'


class VariationSerializer(serializers.ModelSerializer):
    product = ProductSerializer(many=False)

    class Meta:
        model = Variation
        fields = ('id', 'title', 'sku', 'image', 'price', 'product', 'barcode')
        read_only_fields = ('created_at', 'updated_at')
