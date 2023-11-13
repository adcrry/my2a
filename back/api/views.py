from django.shortcuts import render
from django.template import loader
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from education.models import Student, Course
from .serializers import StudentSerializer, CourseSerializer

# from .utils import


class StudentViewset(ReadOnlyModelViewSet):
    """
    A viewset for retrieving Student objects.

    This viewset allows for retrieving all Student objects, one in particular.
    """

    # Example:
    # /api/student/ (all contacts)
    # /api/student/4/ (contact with id 4)

    serializer_class = StudentSerializer

    def get_queryset(self):
        """
        Returns a queryset of all Student objects.
        """

        queryset = Student.objects.all()
        return queryset


class CourseViewset(ReadOnlyModelViewSet):
    """
    A viewset for retrieving Course objects.

    This viewset allows for retrieving all Course objects, one in particular.
    """

    # Example:
    # /api/course/ (all contacts)
    # /api/course/4/ (contact with id 4)

    serializer_class = CourseSerializer

    def get_queryset(self):
        """
        Returns a queryset of all Course objects.
        """

        queryset = Course.objects.all()
        # get parameters from request
        dpt = self.request.GET.get("departement")
        sem = self.request.GET.get("semester")
        day = self.request.GET.get("day")
        # filter by dpt
        if dpt is not None:
            queryset = queryset.filter(department=dpt)
        # filter by sem
        if sem is not None:
            queryset = queryset.filter(semester=sem)
        # filter by day
        if day is not None:
            queryset = queryset.filter(day=day)
        return queryset
