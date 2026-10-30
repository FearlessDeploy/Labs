"""Configuración principal de las URLs del proyecto."""

from django.urls import include, path

urlpatterns = [
    path('', include('app.urls')),
]
