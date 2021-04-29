from rest_framework.views import APIView
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.tokens import default_token_generator
from django.urls.exceptions import NoReverseMatch
from django.utils.timezone import now
from rest_framework import generics, permissions, status, views, viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework_jwt.views import JSONWebTokenAPIView
from authentication import utils, signals
from authentication.compat import get_user_email, get_user_email_field_name
from authentication.conf import settings
from .models import User, Company, CompanyStuff, History, SecurityAnswer, SecurityQuestion
from .serializers import JSONWebTokenSerializer, UserSerializer, CompanySerializer, SecurityAnswerSerializer, \
    SecurityQuestionSerializer, StandardSecurityAnswerSerializer
from ctrl import files
from datetime import datetime
from urllib.request import urlopen
from django.http import Http404, HttpResponseBadRequest
import json
import os
jwt_response_payload_handler = api_settings.JWT_RESPONSE_PAYLOAD_HANDLER


class RootView(views.APIView):
    """
    Root endpoint - use one of sub endpoints.
    """
    permission_classes = [permissions.AllowAny]

    def _get_url_names(self, urllist):
        names = []
        for entry in urllist:
            if hasattr(entry, 'url_patterns'):
                names.extend(self._get_url_names(entry.url_patterns))
            else:
                names.append(entry.name)
        return names

    def aggregate_djoser_urlpattern_names(self):
        from djoser.urls import base, authtoken
        urlpattern_names = self._get_url_names(base.urlpatterns)
        urlpattern_names += self._get_url_names(authtoken.urlpatterns)
        urlpattern_names += self._get_jwt_urlpatterns()

        return urlpattern_names

    def get_urls_map(self, request, urlpattern_names, fmt):
        urls_map = {}
        for urlpattern_name in urlpattern_names:
            try:
                url = reverse(urlpattern_name, request=request, format=fmt)
            except NoReverseMatch:
                url = ''
            urls_map[urlpattern_name] = url
        return urls_map

    def get(self, request, fmt=None):
        urlpattern_names = self.aggregate_djoser_urlpattern_names()
        urls_map = self.get_urls_map(request, urlpattern_names, fmt)
        return Response(urls_map)

    def _get_jwt_urlpatterns(self):
        try:
            from djoser.urls import jwt
            return self._get_url_names(jwt.urlpatterns)
        except ImportError:
            return []


class UserCreateView(generics.CreateAPIView):
    """
    Use this endpoint to register new user.
    """
    serializer_class = settings.SERIALIZERS.user_create
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        """
        save store name to company table
        save user email and pwd
        send email to user for activation
        """

        store = self.request._data['store']
        check_company = Company.objects.filter(name=store).first()
        if check_company:
            raise Http404()

        user = serializer.save()
        signals.user_registered.send(
            sender=self.__class__, user=user, request=self.request
        )

        company = Company.objects.create(name=store)

        CompanyStuff.objects.create(company=company, stuff=user)

        context = {'user': user}
        to = [get_user_email(user)]
        if settings.SEND_ACTIVATION_EMAIL:
            settings.EMAIL.activation(self.request, context).send(to)
        elif settings.SEND_CONFIRMATION_EMAIL:
            settings.EMAIL.confirmation(self.request, context).send(to)


class UserProfileUpdateView(generics.UpdateAPIView):
    """
    Use this endpoint to update user profile.

    """
    serializer_class = UserSerializer

    def get_queryset(self):
        user_id = self.kwargs['pk']
        queryset = User.objects.filter(id=user_id)
        return queryset


class UserUpdateView(APIView):
    """
    Use this endpoint to retrieve/update user.
    """

    def put(self, *args, **kwargs):
        user = self.request.user
        if 'f_avatar' in self.request.data:
            upload_file = self.request.data['f_avatar']
            filename = files.safe_filename('avatar.png')
            content_type = upload_file.split(';')[0].split(':')[1]
            upload_file = upload_file.split(';')[1].split(',')[1]

            if not content_type in ['image/png', 'image/jpeg']:
                result = {"status": 2, "message": "Invalid image type", "info": ""}
                return Response(result)
            public_url = files.uploadAvatar(filename, upload_file, content_type)
            self.request.data['avatar'] = public_url
        serializer = UserSerializer(user, data=self.request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(public_url)


class CheckStoreView(APIView):
    """
    Check when store exist or not

    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        request = request.data
        if 'store' not in request:
            return Response(False)
        store = request['store']
        company = Company.objects.filter(name=store).first()
        if company:
            return Response(True)
        else:
            return Response(False)


class UserPwdResetView(APIView):
    """
    Use this endpoint to update user profile.

    """
    def post(self, request, *args, **kwargs):
        user = self.request.user
        request = request.data
        new_password = request['new_password']
        old_password = request['old_password']
        if user.check_password(old_password):
            user.set_password(new_password)
            user.save()
        else:
            raise Http404
        return Response('success')


class ObtainJwtToken(JSONWebTokenAPIView):
    """
    Get jwt token
    @ params:  username, password, store
    """
    serializer_class = JSONWebTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            user = serializer.object.get('user') or request.user
            if os.getenv('DB_NAME') != 'dropify':
                self.get_client_ip(request, user)
            token = serializer.object.get('token')
            response_data = jwt_response_payload_handler(token, user, request)
            response_data['status'] = user.status
            response = Response(response_data)
            if api_settings.JWT_AUTH_COOKIE:
                expiration = (datetime.utcnow() +
                              api_settings.JWT_EXPIRATION_DELTA)
                response.set_cookie(api_settings.JWT_AUTH_COOKIE,
                                    token,
                                    expires=expiration,
                                    httponly=True)
            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_client_ip(self, request, user):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            print("returning FORWARDED_FOR")
            ip = x_forwarded_for.split(',')[-1].strip()
            url = 'http://ipinfo.io/json'
            response = urlopen(url)
            data = json.load(response)
            country = data['country']
            browser_info = request.META['HTTP_USER_AGENT']
            History.objects.create(user=user, ip_address=ip, browser_info=browser_info, location=country)
        elif request.META.get('HTTP_X_REAL_IP'):
            print("returning REAL_IP")
            ip = request.META.get('HTTP_X_REAL_IP')
            url = 'http://ipinfo.io/json'
            response = urlopen(url)
            data = json.load(response)
            country = data['country']
            browser_info = request.META['HTTP_USER_AGENT']
            History.objects.create(user=user, ip_address=ip, browser_info=browser_info, location=country)
        else:
            print("returning REMOTE_ADDR")
            ip = request.META.get('REMOTE_ADDR', None)
            url = 'http://ipinfo.io/json'
            response = urlopen(url)
            data = json.load(response)

            IP = data['ip']
            org = data['org']
            city = data['city']
            country = data['country']
            region = data['region']
            browser_info = request.META['HTTP_USER_AGENT']
            History.objects.create(user=user, ip_address=ip, browser_info=browser_info, location=country)


class UserDeleteView(generics.CreateAPIView):
    """
    Use this endpoint to remove actually authenticated user
    """
    serializer_class = settings.SERIALIZERS.user_delete
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def post(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)

        utils.logout_user(self.request)
        instance.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class TokenCreateView(utils.ActionViewMixin, generics.GenericAPIView):
    """
    Use this endpoint to obtain user authentication token.
    """
    serializer_class = settings.SERIALIZERS.token_create
    permission_classes = [permissions.AllowAny]

    def _action(self, serializer):
        token = utils.login_user(self.request, serializer.user)
        token_serializer_class = settings.SERIALIZERS.token
        return Response(
            data=token_serializer_class(token).data,
            status=status.HTTP_200_OK,
        )


class TokenDestroyView(views.APIView):
    """
    Use this endpoint to logout user (remove user authentication token).
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        utils.logout_user(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class PasswordResetView(utils.ActionViewMixin, generics.GenericAPIView):
    """
    Use this endpoint to send email to user with password reset link.
    """
    serializer_class = settings.SERIALIZERS.password_reset
    permission_classes = [permissions.AllowAny]

    _users = None

    def _action(self, serializer):
        for user in self.get_users(serializer.data['email']):
            self.send_password_reset_email(user)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get_users(self, email):
        if self._users is None:
            email_field_name = get_user_email_field_name(User)
            users = User._default_manager.filter(**{
                email_field_name + '__iexact': email
            })
            self._users = [
                u for u in users if u.is_active and u.has_usable_password()
            ]
        return self._users

    def send_password_reset_email(self, user):
        context = {'user': user}
        to = [get_user_email(user)]
        settings.EMAIL.password_reset(self.request, context).send(to)


class SetPasswordView(utils.ActionViewMixin, generics.GenericAPIView):
    """
    Use this endpoint to change user password.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if settings.SET_PASSWORD_RETYPE:
            return settings.SERIALIZERS.set_password_retype
        return settings.SERIALIZERS.set_password

    def _action(self, serializer):
        self.request.user.set_password(serializer.data['new_password'])
        self.request.user.save()

        if settings.LOGOUT_ON_PASSWORD_CHANGE:
            utils.logout_user(self.request)

        return Response(status=status.HTTP_204_NO_CONTENT)


class PasswordResetConfirmView(utils.ActionViewMixin, generics.GenericAPIView):
    """
    Use this endpoint to finish reset password process.
    """
    permission_classes = [permissions.AllowAny]
    token_generator = default_token_generator

    def get_serializer_class(self):
        if settings.PASSWORD_RESET_CONFIRM_RETYPE:
            return settings.SERIALIZERS.password_reset_confirm_retype
        return settings.SERIALIZERS.password_reset_confirm

    def _action(self, serializer):
        serializer.user.set_password(serializer.data['new_password'])
        if hasattr(serializer.user, 'last_login'):
            serializer.user.last_login = now()
        serializer.user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ActivationView(utils.ActionViewMixin, generics.GenericAPIView):
    """
    Use this endpoint to activate user account.
    """
    serializer_class = settings.SERIALIZERS.activation
    permission_classes = [permissions.AllowAny]
    token_generator = default_token_generator

    def _action(self, serializer):
        user = serializer.user
        user.is_active = True
        user.save()

        signals.user_activated.send(
            sender=self.__class__, user=user, request=self.request
        )

        if settings.SEND_CONFIRMATION_EMAIL:
            context = {'user': user}
            to = [get_user_email(user)]
            settings.EMAIL.confirmation(self.request, context).send(to)
        return Response(status=status.HTTP_204_NO_CONTENT)


class SetUsernameView(utils.ActionViewMixin, generics.GenericAPIView):
    """
    Use this endpoint to change user username.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if settings.SET_USERNAME_RETYPE:
            return settings.SERIALIZERS.set_username_retype
        return settings.SERIALIZERS.set_username

    def _action(self, serializer):
        user = self.request.user
        new_username = serializer.data['new_' + User.USERNAME_FIELD]

        setattr(user, User.USERNAME_FIELD, new_username)
        if settings.SEND_ACTIVATION_EMAIL:
            user.is_active = False
            context = {'user': user}
            to = [get_user_email(user)]
            settings.EMAIL.activation(self.request, context).send(to)
        user.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class UserView(generics.RetrieveUpdateAPIView):
    """
    Use this endpoint to retrieve/update user.
    """
    model = User
    serializer_class = settings.SERIALIZERS.user
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, *args, **kwargs):
        return self.request.user

    def perform_update(self, serializer):
        super(UserView, self).perform_update(serializer)
        user = serializer.instance
        if settings.SEND_ACTIVATION_EMAIL and not user.is_active:
            context = {'user': user}
            to = [get_user_email(user)]
            settings.EMAIL.activation(self.request, context).send(to)


class UserViewSet(UserCreateView, viewsets.ModelViewSet):
    serializer_class = settings.SERIALIZERS.user
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    token_generator = default_token_generator

    def get_permissions(self):
        if self.action in ['create', 'confirm']:
            self.permission_classes = [permissions.AllowAny]
        elif self.action == 'list':
            self.permission_classes = [permissions.IsAdminUser]
        return super(UserViewSet, self).get_permissions()

    def get_serializer_class(self):
        if self.action == 'me':
            # Use the current user serializer on 'me' endpoints
            self.serializer_class = settings.SERIALIZERS.current_user

        if self.action == 'create':
            return settings.SERIALIZERS.user_create

        elif self.action == 'remove' or (
                self.action == 'me' and self.request and
                self.request.method == 'DELETE'
        ):
            return settings.SERIALIZERS.user_delete

        elif self.action == 'confirm':
            return settings.SERIALIZERS.activation

        elif self.action == 'change_username':
            if settings.SET_USERNAME_RETYPE:
                return settings.SERIALIZERS.set_username_retype

            return settings.SERIALIZERS.set_username

        return self.serializer_class

    def get_instance(self):
        return self.request.user

    def perform_update(self, serializer):
        super(UserViewSet, self).perform_update(serializer)
        user = serializer.instance
        if settings.SEND_ACTIVATION_EMAIL and not user.is_active:
            context = {'user': user}
            to = [get_user_email(user)]
            settings.EMAIL.activation(self.request, context).send(to)

    def perform_destroy(self, instance):
        utils.logout_user(self.request)
        super(UserViewSet, self).perform_destroy(instance)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @list_route(['get', 'put', 'patch', 'delete'])
    def me(self, request, *args, **kwargs):
        self.get_object = self.get_instance
        if request.method == 'GET':
            return self.retrieve(request, *args, **kwargs)
        elif request.method == 'PUT':
            return self.update(request, *args, **kwargs)
        elif request.method == 'PATCH':
            return self.partial_update(request, *args, **kwargs)
        elif request.method == 'DELETE':
            return self.destroy(request, *args, **kwargs)

    @list_route(['post'])
    def confirm(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user
        user.is_active = True
        user.save()

        signals.user_activated.send(
            sender=self.__class__, user=user, request=self.request
        )

        if settings.SEND_CONFIRMATION_EMAIL:
            context = {'user': user}
            to = [get_user_email(user)]
            settings.EMAIL.confirmation(self.request, context).send(to)

        return Response(status=status.HTTP_204_NO_CONTENT)

    @list_route(['post'])
    def change_username(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.request.user
        new_username = serializer.data['new_' + User.USERNAME_FIELD]

        setattr(user, User.USERNAME_FIELD, new_username)
        if settings.SEND_ACTIVATION_EMAIL:
            user.is_active = False
            context = {'user': user}
            to = [get_user_email(user)]
            settings.EMAIL.activation(self.request, context).send(to)
        user.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class CompanyListView(generics.ListAPIView):
    serializer_class = CompanySerializer

    def get_queryset(self):
        user = self.request.user
        company_stuff = CompanyStuff.objects.filter(stuff=user).first()
        queryset = Company.objects.filter(id=company_stuff.company.id)
        return queryset


class CompanyUpdateView(APIView):
    serializer_class = CompanySerializer

    def put(self, *args, **kwargs):
        user = self.request.user
        pk = kwargs['id']
        company = Company.objects.filter(id=pk).first()
        company_serializer = CompanySerializer(company, self.request.data)
        company_serializer.is_valid(raise_exception=True)
        company_serializer.save()
        user.status = 3
        user.save()
        return Response(company_serializer.data)


class SecurityQuestionView(generics.ListCreateAPIView):
    queryset = SecurityQuestion.objects.all()
    serializer_class = SecurityQuestionSerializer


class SecurityAnswerView(APIView):

    def get(self, *args, **kwargs):
        user = self.request.user
        security_answer = SecurityAnswer.objects.filter(user=user).first()
        if security_answer:
            securityAnswer_serializer = SecurityAnswerSerializer(security_answer, many=False)
        else:
            raise Http404
        return Response(securityAnswer_serializer.data)

    def post(self, *args, **kwargs):
        self.request.data['user'] = self.request.user.id
        user = self.request.user
        security_answer = SecurityAnswer.objects.filter(user=user).first()
        if security_answer:
            securityAnswer_serializer = StandardSecurityAnswerSerializer(security_answer, self.request.data)
        else:
            securityAnswer_serializer = StandardSecurityAnswerSerializer(data=self.request.data)
        securityAnswer_serializer.is_valid(raise_exception=True)
        securityAnswer_serializer.save()

        return Response(securityAnswer_serializer.data)


class SecurityConfirmView(APIView):

    def post(self, *args, **kwargs):
        if 'answer' not in self.request.data:
            raise Http404
        answer = self.request.data['answer']
        user = self.request.user
        security_answer = SecurityAnswer.objects.filter(user=user, answer=answer).first()
        if security_answer:
            return Response(True)
        else:
            raise Http404


class GetLocationView(APIView):
    serializer_class = CompanySerializer

    def get(self, *args, **kwargs):
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            print("returning FORWARDED_FOR")
            url = 'http://ipinfo.io/json'
            response = urlopen(url)
            data = json.load(response)
            return Response(data['log'])
        elif self.request.META.get('HTTP_X_REAL_IP'):
            print("returning REAL_IP")
            url = 'http://ipinfo.io/json'
            response = urlopen(url)
            data = json.load(response)
            return Response(data['log'])

        else:
            print("returning REMOTE_ADDR")
            url = 'http://ipinfo.io/json'
            response = urlopen(url)
            data = json.load(response)
            return Response(data['log'])



