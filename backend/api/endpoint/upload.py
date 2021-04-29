from ctrl import files
from rest_framework.views import APIView
from rest_framework.response import Response


class UploadImage(APIView):
    """
    uploading avatars to statics/images

    """

    def post(self, request, *args, **kwargs):
        upload_file = request.FILES['file']
        filename = files.safe_filename(upload_file.name)
        content_type = upload_file.content_type

        if not content_type in ['image/png', 'image/jpeg']:
            result = {"status": 2, "message": "Invalid image type", "info": ""}
            return Response(result)

        public_url = files.uploadImage(filename, upload_file, content_type)
        return Response(public_url)
