from django.urls import path
from .views import typing_test_view

from django.urls import path
from .views import typing_test_view

urlpatterns = [
    path('', typing_test_view, name='home'),
]