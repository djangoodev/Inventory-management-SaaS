from rest_framework import serializers
from api.models import History


class HistorySerializer(serializers.ModelSerializer):

    class Meta:
        model = History
        fields = ('id', 'user', 'ip_address', 'browser_info', 'location', 'created_at', 'updated_at')

