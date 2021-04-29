from rest_framework import serializers
from api_category.models import Category


class StandardCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ('id', 'parent', 'title')


class CategorySerializer(serializers.ModelSerializer):

    children = serializers.SerializerMethodField('get_category_children')

    def get_category_children(self, category):
        categories = Category.objects.filter(parent=category.id).all()

        if len(categories):
            serializer_categories = CategorySerializer(categories, many=True)
            return serializer_categories.data
        else:
            return None

    class Meta:
        model = Category
        fields = ('id', 'parent', 'title', 'children')


class CategoryForSubscribeSerializer(serializers.ModelSerializer):

    children = serializers.SerializerMethodField('get_category_children')

    def get_category_children(self, category):
        categories = Category.objects.filter(parent=category.id).all()

        if len(categories):
            serializer_categories = CategoryForSubscribeSerializer(categories, many=True)
            return serializer_categories.data
        else:
            return None

    name = serializers.SerializerMethodField('get_category_name')

    def get_category_name(self, category):
        return 'following'

    class Meta:
        model = Category
        fields = ('id', 'parent', 'title', 'name', 'children')


class CategoryWithParentSerializer(serializers.ModelSerializer):
    parent = serializers.SerializerMethodField('get_category_parent')

    def get_category_parent(self, category):
        parent = Category.objects.filter(id=category.parent).first()

        if parent:
            serializer_categories = CategoryWithParentSerializer(parent)
            return serializer_categories.data
        else:
            return None

    class Meta:
        model = Category
        fields = ('id', 'parent', 'title', 'parent')


class CategoryForRevisionSerializer(serializers.ModelSerializer):
    dir_categories = serializers.SerializerMethodField('get_dir_categories_for_revision')
    _dirs = []

    def get_dir_categories_for_revision(self, category):
        self._dirs = []
        self.get_full_dirs(category)
        return self._dirs

    def get_full_dirs(self, category):
        self._dirs.append({'id': category.id, 'title': category.title})
        if category.parent != 0:
            parent = Category.objects.filter(id=category.parent).first()
            self.get_full_dirs(parent)
        else:
            self._dirs.reverse()

    class Meta:
        model = Category
        fields = ('id', 'parent', 'title', 'dir_categories')
