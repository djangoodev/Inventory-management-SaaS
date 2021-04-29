from ctrl import files
from rest_framework.views import APIView
from rest_framework.response import Response
from shopify_webhook.decorators import webhook
from rest_framework import permissions


class WebHook(APIView):
    """
    uploading avatars to statics/images

    """
    permission_classes = [permissions.AllowAny]
    def post(self, request, *args, **kwargs):
        a = request

        return Response('OK')

