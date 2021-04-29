from rest_framework import generics
from api.models import Company, CompanyStuff
from api.serializers import CompanySerializer, CompanyStuffSerializer


class CompanyView(generics.ListCreateAPIView):
    serializer_class = CompanyStuffSerializer

    def get_queryset(self):
        company_id = self.kwargs['company_id']
        company = Company.objects.filter(id=company_id).first()
        queryset = CompanyStuff.objects.filter(company=company)
        return queryset
