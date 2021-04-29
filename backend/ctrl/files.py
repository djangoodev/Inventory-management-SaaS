from django.conf import settings
import boto3
import datetime
import os
import io as BytesIOModule
from PIL import Image

s3_resource = boto3.resource('s3', aws_access_key_id=settings.AWS_ACCESS_KEY,
                        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)


def resize_image(file, filename):
    '''
    :param filename:
    :param file:
    convert image which is bigger than 200kb to 900 * 900 thumbnail
    :return: byte data
    '''
    image = Image.open(file)
    image.thumbnail((900, 900))
    thumb_buffer = BytesIOModule.BytesIO()
    image.save(thumb_buffer, format=image.format)
    fp = open(filename, "wb")
    fp.write(thumb_buffer.getvalue())
    fp.close()
    fp = open(filename, "rb")
    os.remove(filename)
    return fp


def convert_to_webp_image(file, filename):
    image = Image.open(file)
    image.thumbnail((200, 200))
    thumb_buffer = BytesIOModule.BytesIO()
    image.save(thumb_buffer, format='webp', quality=100)
    fp = open(filename, "wb")
    fp.write(thumb_buffer.getvalue())
    fp.close()
    fp = open(filename, "rb")
    os.remove(filename)
    return fp


def safe_filename(filename):
    """
    Generates a safe filename that is unlikely to collide with existing objects
    in AWS S3 bucket.
    ``filename.ext`` is transformed into ``filename-YYYY-MM-DD-HHMMSS.ext``
    """
    filename = filename.replace(" ", "_").lower()
    date = datetime.datetime.utcnow().strftime("%Y-%m-%d-%H%M%S")
    basename, extension = filename.rsplit('.', 1)
    return "{0}-{1}.{2}".format(basename, date, extension)


def get_names_from_url(url):
    file = url.split('/')[-1]
    name = file.split('.')
    return name[0], name[1]


def uploadImage(filename, file, type):
    '''
    :param filename:
    :param file:
    :param type:
    upload image to s3 bucket in aws
    :return: public url
    '''

    s3 = boto3.resource('s3', aws_access_key_id=settings.AWS_ACCESS_KEY,
                        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
    bucket = s3.Bucket(settings.BUCKET_NAME)
    basename, extension = filename.rsplit('.', 1)

    # convert image to thumbnail image (900 * 900)
    resized_image = resize_image(file, filename)
    bucket.put_object(Key=settings.DIR_PRODUCT + filename, Body=resized_image.read(), ContentType=type)

    # thumbnail
    thumbnail = convert_to_webp_image(file, filename)
    bucket.put_object(Key=settings.DIR_PRODUCT + basename + '.webp', Body=thumbnail.read(), ContentType='webp')
    public_url = settings.AWS_BASE_URL + settings.DIR_PRODUCT + filename
    return public_url


import base64


def base64toimage(imgstring, filename):
    imgdata = base64.b64decode(imgstring)
    with open(filename, 'wb') as f:
        f.write(imgdata)
        f.close()
    fp = open(filename, "rb")
    os.remove(filename)
    return fp


def uploadAvatar(filename, file, type):
    '''
    :param filename:
    :param file:
    :param type:
    upload image to s3 bucket in aws
    :return: public url
    '''

    s3 = boto3.resource('s3', aws_access_key_id=settings.AWS_ACCESS_KEY,
                        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
    bucket = s3.Bucket(settings.BUCKET_NAME)
    basename, extension = filename.rsplit('.', 1)
    resized_image = base64toimage(file, filename)
    thumbnail = convert_to_webp_image(resized_image, filename)
    bucket.put_object(Key=settings.DIR_AVATAR + basename + '.webp', Body=thumbnail.read(), ContentType='webp')
    public_url = settings.AWS_BASE_URL + settings.DIR_AVATAR + basename + '.webp'

    return public_url


def delete_multi_images(images):
    """
    Delete multiple images at ones in s3 bucket with boto3
    :param iamges:
    :return: None
    """
    s3 = boto3.resource('s3', aws_access_key_id=settings.AWS_ACCESS_KEY,
                        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)

    bucket = s3.Bucket(settings.BUCKET_NAME)

    objects_to_delete = []
    for image in images:
        objects_to_delete.append({'Key': get_filename_from_url(image.image_url)})

    bucket.delete_objects(
        Delete={
            'Objects': objects_to_delete
        }
    )


def delete_single_image(key):
    """
    Delete singe image in s3 bucket with boto3
    :param iamge:
    :return: None
    """
    session = boto3.Session(settings.AWS_ACCESS_KEY, settings.AWS_SECRET_ACCESS_KEY)

    s3 = session.client('s3')
    s3.delete_object(Bucket=settings.BUCKET_NAME, Key=key)


def get_filename_from_url(url):
    """
    get file name from ulr
    :param url: https://s3-us-west-1.amazonaws.com/360degreeimage/deep_sea_diving_helmet-143-61-2019-01-22-072614.jpg
    :return: deep_sea_diving_helmet-143-61-2019-01-22-072614.jpg

    """
    filename = url.split('/')[-1]
    return filename


def move_tmp_to_attachment(image):
    filename, extention = get_names_from_url(image)
    copy_source = {
        'Bucket': settings.BUCKET_NAME,
        'Key': 'tmp/' + filename + '.' + extention
    }
    s3_resource.meta.client.copy(copy_source, settings.BUCKET_NAME, 'image/g/' + filename + '.' + extention)
    delete_single_image('tmp/' + filename + '.' + extention)
    copy_source = {
        'Bucket': settings.BUCKET_NAME,
        'Key': 'tmp/' + filename + '.webp'
    }
    s3_resource.meta.client.copy(copy_source, settings.BUCKET_NAME, 'image/thumbnail/' + filename + '.webp')
    delete_single_image('tmp/' + filename + '.webp')

