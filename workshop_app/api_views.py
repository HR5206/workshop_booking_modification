from rest_framework.status import HTTP_200_OK
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils import timezone

from .models import Profile
from .serializers import UserSerializer, ProfileDetailSerializer
from .send_mails import generate_activation_key

@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):

    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            { 'error': 'Please provide both username and password'},
            status = status.HTTP_400_BAD_REQUEST
        )

    # Convert username to lowercase to match registration logic
    username = username.lower()

    user = authenticate(username=username, password=password)

    if not user:
        return Response(
            {'error': 'Invalid username or password'},
            status = status.HTTP_401_UNAUTHORIZED
        )

    # Check if profile exists to avoid 500 errors
    if not hasattr(user, 'profile'):
        return Response(
            {'error': 'User profile not found. Please contact administrator.'},
            status = status.HTTP_400_BAD_REQUEST
        )

    if not user.profile.is_email_verified:
        return Response(
            {'error': 'Email not verified. Please check your email.'},
            status = status.HTTP_401_UNAUTHORIZED
        )

    token, _ = Token.objects.get_or_create(user=user)

    is_instructor = user.profile.position == 'instructor'

    return Response({
        'token': token.key,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_instructor': is_instructor,
        }
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def api_register(request):

    data = request.data

    required_fields = [
        'username', 'email', 'password', 'confirm_password',
        'first_name', 'last_name', 'phone_number', 'institute',
        'department', 'location', 'state'
    ]

    for field in required_fields:

        if not data.get(field):
            return Response(
                {'error': f'{field} is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    if data['password'] != data['confirm_password']:
        return Response(
            {'error': 'Passwords do not match'},
            status = status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=data['username']).exists():
        return Response(
            {'error': 'Username already exists'},
            status = status.HTTP_400_BAD_REQUEST
        )
    
    if User.objects.filter(email=data['email']).exists():
        return Response(
            {'error': 'Email already exists'},
            status = status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username = data['username'].lower(),
        email=data['email'],
        password=data['password']
    )

    user.first_name = data['first_name']
    user.last_name = data['last_name']
    user.save()

    profile = Profile.objects.create(
        user = user,
        title = data.get('title', 'Mr'),
        institute = data['institute'],
        department = data['department'],
        phone_number = data['phone_number'],
        position = data.get('position', 'coordinator'),
        location = data['location'],
        state = data['state'],
        how_did_you_hear_about_us=data.get('how_did_you_hear_about_us', ''),
        activation_key=generate_activation_key(user.username),
        key_expiry_time=timezone.now() + timezone.timedelta(days=1)
    )


    return Response(
        {'message': 'Registration successful.. Please check your email to activate your account.'},
        status = status.HTTP_201_CREATED
    )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_logout(request):

    request.user.auth_token.delete()

    return Response(
        {'message': 'Logged out successfully'},
        status = HTTP_200_OK
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_my_profile(request):

    profile = request.user.profile
    serializer = ProfileDetailSerializer(profile)

    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def api_update_profile(request):

    profile = request.user.profile
    user = request.user

    user.first_name = request.data.get('first_name', user.first_name)
    user.last_name = request.data.get('last_name', user.last_name)
    user.save()

    from .serializers import ProfileSerializer
    serializer = ProfileSerializer(profile, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()

        return Response(ProfileDetailSerializer(profile).data)

    return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

from rest_framework import viewsets 
from rest_framework.decorators import action
from django.db.models import Q

from .models import Workshop, WorkshopType, Comment, Testimonial, Banner
from .serializers import (
    WorkshopSerializer, WorkshopTypeSerializer,
    CommentSerializer, TestimonialSerializer, BannerSerializer
)
import datetime as dt

class WorkshopTypeViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = WorkshopType.objects.all().order_by('id')
    serializer_class = WorkshopTypeSerializer
    permission_classes = [AllowAny]

class WorkshopViewSet(viewsets.ModelViewSet):

    serializer_class = WorkshopSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user
        is_instr = user.profile.position == 'instructor'

        if is_instr:

            today = timezone.now().date()
            return Workshop.objects.filter(
                Q(instructor=user, date__gte=today) | Q(status=0)
            ).order_by('-date')

        else: 

            return Workshop.objects.filter(
                coordinator=user
            ).order_by('-date')


    def perform_create(self, serializer):

        serializer.save(coordinator=self.request.user)

    @action(detail=True, methods=['POST'])
    def accept(self, request, pk=None):

        if request.user.profile.position != 'instructor':
            return Response(
                {'error': 'Only instructors can accept workshops'},
                status = status.HTTP_403_FORBIDDEN
            )

        workshop = self.get_object()

        if workshop.status == 1:
            return Response(
                {'error': 'Workshop is already accepted'},
                status = status.HTTP_400_BAD_REQUEST
            )

        workshop.status = 1
        workshop.instructor = request.user
        workshop.save()

        serializer = self.get_serializer(workshop)
        return Response({
            'message': 'Workshop accepted successfully!',
            'workshop': serializer.data
        })

    @action(detail=True, methods=['post'])
    def change_date(self, request, pk=None):

        if request.user.profile.position != 'instructor':
            return Response(
                {'error': 'Only instructors can change workshop dates'},
                status = status.HTTP_403_FORBIDDEN
            )

        new_date = request.data.get('new_date')
        if not new_date:
            return Response(
                {'error': 'new_date is required'},
                status = status.HTTP_400_BAD_REQUEST
            )

        workshop = self.get_object()
        old_date = str(workshop.date)
        workshop.date = new_date
        workshop.save()

        serializer = self.get_serializer(workshop)
        return Response({
            'message': f'Workshop date changed from {old_date} to {new_date}',
            'workshop': serializer.data
        })


class CommentViewSet(viewsets.ModelViewSet):


    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user
        is_instr = user.profile.position == 'instructor'

        qs = Comment.objects.all()

        workshop_id = self.request.query_params.get('workshop')
        if workshop_id:
            qs = qs.filter(workshop_id=workshop_id)

        if not is_instr:
            qs = qs.filter(public=True)

        return qs.order_by('-created_date')

    def perform_create(self, serializer):

        serializer.save(author=self.request.user)

@api_view(['GET'])
@permission_classes([AllowAny])
def api_workshop_stats(request):

    from_date = request.query_params.get('from_date')
    to_date = request.query_params.get('to_date')
    state = request.query_params.get('state')
    workshop_type = request.query_params.get('workshop_type')

    if from_date and to_date:

        workshops = Workshop.objects.filter(
            date__range = (from_date, to_date), status = 1
        )
    
    else:
        # Default to all accepted workshops for the 'All-time' view
        workshops = Workshop.objects.filter(status=1)

    if state:
        workshops = workshops.filter(coordinator__profile__state=state)
    
    if workshop_type:
        workshops = workshops.filter(workshop_type_id = workshop_type)

    workshops = workshops.order_by('-date')


    ws_states, ws_state_counts = Workshop.objects.get_workshops_by_state(workshops)
    ws_types, ws_type_counts = Workshop.objects.get_workshops_by_type(workshops)

    serializer = WorkshopSerializer(workshops, many = True)


    return Response ({
        'workshops': serializer.data,
        'chart_data': {
            'states': ws_states,
            'state_counts': ws_state_counts, 
            'types': ws_types,
            'type_counts': ws_type_counts,
        },
        'total_count': workshops.count()
    })