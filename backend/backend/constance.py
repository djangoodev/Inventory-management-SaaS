import os

""" aws access info """
AWS_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
BUCKET_NAME = os.getenv('BUCKET_NAME')
AWS_BASE_URL = os.getenv('AWS_BASE_URL')
DIR_PRODUCT = os.getenv('DIR_PRODUCT')
DIR_AVATAR = os.getenv('DIR_AVATAR')

""" notification types """
TWILIO_SECURITY_API_KEY = os.getenv('TWILIO_SECURITY_API_KEY')

""" notification types """
NOTIFICATION_TRANSFER = 0
NOTIFICATION_UPDATE = 1
NOTIFICATION_ALARM = 2

""" notification states """
UNCHECKED_NOTIFICATION = 0
CHECKED_NOTIFICATION = 1


