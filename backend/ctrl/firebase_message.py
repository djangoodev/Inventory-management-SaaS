from django.conf import settings as const
from api.models import Collection, Category, Make, \
    Model, Artifact, CollectionArtifact, Image, Transfer, Notification
from api.serializers import CollectionSerializer, CategorySerializer, \
    MakeSerializer, ModelSerializer, ArtifactSerializer, CollectionArtifactSerializer, ImageSerializer, \
    NotificationSerializer, TransferSerializer

def get_content(type, sender, ref_id):
    if type == const.NOTIFICATION_TRANSFER:
        artifact = Artifact.objects.filter(id=ref_id).all().first()
        content = """%s has transferred to you %s""" % (sender.username, artifact.title)
        return content
    elif type == const.NOTIFICATION_ALARM:
        artifact = Artifact.objects.filter(id=ref_id).all().first()
        content = """%s has accepted the %s you transferred""" % (sender.username, artifact.title)
        return content