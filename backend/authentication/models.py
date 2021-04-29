from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import AbstractUser, AbstractBaseUser, BaseUserManager
from django.db import models
from datetime import datetime


class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    STATUS_CHOICES = (
        (0, 'Pending'),
        (1, 'Phone Verified'),
        (2, 'Personal Info Passed'),
        (3, 'Store Info Passed')
    )
    password = models.CharField(max_length=400)
    username = None
    surname = models.CharField(max_length=400, blank=True)
    name = models.CharField(max_length=400, blank=True)
    phone = models.CharField(max_length=400, blank=True)
    phone_verified = models.BooleanField(default=False)
    email = models.EmailField(unique=True)
    country = models.CharField(max_length=400, blank=True)
    state = models.CharField(max_length=400, blank=True)
    city = models.CharField(max_length=400, blank=True)
    address = models.CharField(max_length=400, blank=True)
    postal_code = models.CharField(max_length=400, blank=True)
    birthday = models.DateField(blank=True, null=True)
    gender = models.IntegerField(default=1)
    avatar = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    status = models.IntegerField(choices=STATUS_CHOICES, default=0)
    first_name = None
    last_name = None
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        db_table = 'auth_user'

    def __str__(self):
        return self.email


class Company(models.Model):
    name = models.CharField(max_length=400, blank=True, default='')
    phone = models.CharField(max_length=400, blank=True)
    phone_verified = models.BooleanField(default=False)
    country = models.CharField(max_length=400, blank=True)
    state = models.CharField(max_length=400, blank=True)
    city = models.CharField(max_length=400, blank=True)
    address = models.CharField(max_length=400, blank=True)
    postal_code = models.CharField(max_length=400, blank=True)
    longitude = models.FloatField(default=0)
    latitude = models.FloatField(default=0)

    class Meta:
        db_table = 'company'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return self.name


class CompanyStuff(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    stuff = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.IntegerField(default=0)


    class Meta:
        db_table = 'company_stuff'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return self.company.name


class History(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ip_address = models.CharField(max_length=400, blank=True, default='')
    browser_info = models.CharField(max_length=400, blank=True, default='')
    location = models.CharField(max_length=400, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'history'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return self.ip_address


class SecurityQuestion(models.Model):
    question = models.TextField(blank=True, default='')

    class Meta:
        db_table = 'security_question'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return self.question


class SecurityAnswer(models.Model):
    question = models.ForeignKey(SecurityQuestion, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    answer = models.TextField(blank=True, default='')

    class Meta:
        db_table = 'security_answer'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return self.answer
