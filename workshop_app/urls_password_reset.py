from django.urls import re_path
from django.contrib.auth.views import password_reset, password_reset_confirm,\
        password_reset_done, password_reset_complete, password_change,\
        password_change_done

urlpatterns = [
    re_path(r'^forgotpassword/$', password_reset,
        name="password_reset"),
    re_path(r'^password_reset/(?P<uidb64>[0-9A-Za-z]+)-(?P<token>.+)/$',
        password_reset_confirm,
        name='password_reset_confirm'),
    re_path(r'^password_reset/mail_sent/$', password_reset_done,
        name='password_reset_done'),
    re_path(r'^password_reset/complete/$', password_reset_complete,
        name='password_reset_complete'),
    re_path(r'^changepassword/$', password_change,
        name='password_change'),
    re_path(r'^password_change/done/$', password_change_done,
        name='password_change_done'),
]
