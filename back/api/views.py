from django.shortcuts import render
from django.template import loader
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from education.models import Student, Course
from .serializers import StudentSerializer, CourseSerializer

# from .utils import
