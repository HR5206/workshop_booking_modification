from django.urls import re_path, include
from rest_framework.routers import DefaultRouter
from . import api_views

router = DefaultRouter()
router.register(r'workshops', api_views.WorkshopViewSet, basename='workshop')
router.register(r'workshop-types', api_views.WorkshopTypeViewSet)
router.register(r'comments', api_views.CommentViewSet, basename='comment')

urlpatterns = [
    re_path(r'^auth/login/$', api_views.api_login, name='api_login'),
    re_path(r'^auth/register/$', api_views.api_register, name='api_register'),
    re_path(r'^auth/logout', api_views.api_logout, name='api_logout'),

    re_path(r'^profile/me/$', api_views.api_my_profile, name='api_my_profile'),
    re_path(r'^profile/update/$', api_views.api_update_profile, name='api_update_profile'),

    re_path(r'^stats/$', api_views.api_workshop_stats, name='api_workshop_stats'),

    re_path(r'^', include(router.urls))
]