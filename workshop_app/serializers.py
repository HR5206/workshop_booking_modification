"""
Serializers for the Workshop Booking API.
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Profile, Workshop, WorkshopType,
    Comment, Testimonial, Banner, AttachmentFile
)

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
        ]

class ProfileSerializer(serializers.ModelSerializer):

    user = UserSerializer(read_only = True)

    class Meta:
        model = Profile
        fields = '__all__'

class WorkshopTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = WorkshopType
        fields = '__all__'


class WorkshopSerializer(serializers.ModelSerializer):

    coordinator = UserSerializer(read_only=True)
    instructor = UserSerializer(read_only=True)
    workshop_type = WorkshopTypeSerializer(read_only=True)

    workshop_type_id = serializers.PrimaryKeyRelatedField(
        queryset = WorkshopType.objects.all(),
        source='workshop_type',
        write_only=True
    )

    status_display = serializers.CharField(
        source='get_status',
        read_only=True
    )

    class Meta:
        model = Workshop
        fields = [
            'id', 'uid', 'coordinator', 'instructor',
            'workshop_type', 'workshop_type_id',
            'date', 'status', 'status_display', 'tnc_accepted'
        ]
        read_only_fields = ['uid', 'coordinator', 'instructor', 'status']


class CommentSerializer(serializers.ModelSerializer):

    author = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'author', 'comment', 'public', 'created_date', 'workshop']
        read_only_fields = ['author', 'created_date']

class TestimonialSerializer(serializers.ModelSerializer):

    class Meta:
        model = Testimonial
        fields = '__all__'

class BannerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Banner
        fields = '__all__'

class ProfileDetailSerializer(serializers.ModelSerializer):

    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = '__all__'

    def get_workshops_count(self, obj):

        return Workshop.objects.filter(coordinator=obj.user).count()