"""my2a URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

import django_cas_ng.views
from django.contrib import admin
from django.urls import include, path
from education.views import auth_view

urlpatterns = [
    path("admin/", admin.site.urls),
    path("education/", include("education.urls")),
    path("api/", include("api.urls")),
    path("cas/login/", django_cas_ng.views.LoginView.as_view(), name="cas_ng_login"),
    path("cas/logout/", django_cas_ng.views.LogoutView.as_view(), name="cas_ng_logout"),
    path("accounts/login/", auth_view, name="login"),
    path("accounts/", include("django.contrib.auth.urls")), 
]
