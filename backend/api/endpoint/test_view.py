from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions, status, views, viewsets
from socketio_app.views import sio
# import socketio
#
# async_mode = None
# sio = socketio.Server(async_mode=async_mode)


class TestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        print("=-======>>>>>>>>>>>>>>>>")
        print(sio)
        sio.emit('my response', {'data': 'Server generated event'},
                 namespace='/test')
        sio.emit('create_product', {'data': "testfdfdfdsf"}, namespace='/test')
        return Response('success')
