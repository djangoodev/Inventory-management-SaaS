from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from django.http import Http404
from authy.api import AuthyApiClient
from django.conf import settings
authy_api = AuthyApiClient(settings.TWILIO_SECURITY_API_KEY)


class PhoneSMSSendView(APIView):
    """
    Check when store exist or not

    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        if 'phone_number' not in request.data or 'country_code' not in request.data:
            raise Http404
        auth = authy_api.phones.verification_start(
            request.data['phone_number'],
            request.data['country_code'],
            via="sms"
        )
        return Response('sent')


class PhoneVerifyView(APIView):
    """
    Check when store exist or not

    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        if 'phone_number' not in request.data or 'country_code' not in request.data or 'token' not in request.data:
            raise Http404
        verification = authy_api.phones.verification_check(
            request.data['phone_number'],
            request.data['country_code'],
            request.data['token']
        )

        if verification.ok():
            return Response('success')
        else:
            raise Http404
