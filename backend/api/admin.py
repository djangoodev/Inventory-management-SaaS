# from django.contrib import admin
# from api.models import Company, CompanyStuff, Customer, Product, VariationType, VariationTypeAttribute, \
#     Variation, Order, History
#
#
# class CompanyAdmin(admin.ModelAdmin):
#     model = Company
#     list_display = ['id', 'name']
#
#
# admin.site.register(Company, CompanyAdmin)
#
#
# class CompanyStuffAdmin(admin.ModelAdmin):
#     model = CompanyStuff
#     list_display = ['id', 'company', 'stuff', 'role']
#
#
# admin.site.register(CompanyStuff, CompanyStuffAdmin)
#
#
# class CustomerAdmin(admin.ModelAdmin):
#     model = Customer
#     list_display = ['id', 'first_name', 'last_name', 'email', 'owner', 'company', 'phone', 'apartment', 'address', 'city',
#                     'country', 'region', 'postal_code', 'image']
#
#
# admin.site.register(Customer, CustomerAdmin)
#
#
# class ProductAdmin(admin.ModelAdmin):
#     model = Product
#     list_display = ['id', 'name', 'description', 'company', 'image', 'sku', 'price', 'is_active']
#
#
# admin.site.register(Product, ProductAdmin)
#
#
# class VariationTypeAdmin(admin.ModelAdmin):
#     model = VariationType
#     list_display = ['id', 'product', 'type']
#
#
# admin.site.register(VariationType, VariationTypeAdmin)
#
#
# class VariationTypeAttributeAdmin(admin.ModelAdmin):
#     model = VariationTypeAttribute
#     list_display = ['id', 'variation_type', 'attribute']
#
#
# admin.site.register(VariationTypeAttribute, VariationTypeAttributeAdmin)
#
#
# class VariationAdmin(admin.ModelAdmin):
#     model = Variation
#     list_display = ['id', 'product', 'title', 'sku', 'image', 'barcode', 'price', 'created_at', 'updated_at']
#
#
# admin.site.register(Variation, VariationAdmin)
#
#
# class OrderAdmin(admin.ModelAdmin):
#     model = Order
#     list_display = ['id', 'products', 'amounts', 'customer', 'owner', 'total_price', 'total_tax', 'payment', 'updated_at', 'created_at']
#
#
# admin.site.register(Order, OrderAdmin)
#
#
# class HistoryAdmin(admin.ModelAdmin):
#     model = History
#     list_display = ['id', 'user', 'ip_address', 'browser_info', 'location', 'created_at', 'updated_at']
#
#
# admin.site.register(History, HistoryAdmin)
