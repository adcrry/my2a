from django.shortcuts import render, redirect
from django.template import loader
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from .models import Student, Course, Department, Parcours
from .serializers import (
    StudentSerializer,
    CourseSerializer,
    DepartmentSerializer,
    ParcoursSerializer,
)


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")


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
    We can also filter by department, semester and day.
    """

    # Example:
    # /api/course/ (all contacts)
    # /api/course/4/ (contact with id 4)
    # /api/course/?departement=IMI (all IMI courses)
    # /api/course/?semester=S3
    # /api/course/?day=Lundi
    # (all course mandatory for Vision Aprentissage parcours)
    # /api/course/?parcours=1&mandatory=1

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
        parcours = self.request.GET.get("parcours")
        mandatory = self.request.GET.get("mandatory")
        onList = self.request.GET.get("on_list")
        # filter by dpt
        if dpt is not None:
            queryset = queryset.filter(department__code=dpt)
        # filter by sem
        if sem is not None:
            queryset = queryset.filter(semester=sem)
        # filter by day
        if day is not None:
            queryset = queryset.filter(day=day)

        # filter by parcours
        if parcours is not None:
            parcours_obj = Parcours.objects.get(id=parcours)
            if mandatory is not None:
                queryset = parcours_obj.courses_mandatory.all()
            elif onList is not None:
                queryset = parcours_obj.courses_on_list.all()
            else:
                # return everything
                queryset = queryset.union(
                    parcours_obj.courses_mandatory.all(),
                    parcours_obj.courses_on_list.all(),
                )

        return queryset


class DepartmentViewset(ReadOnlyModelViewSet):
    """
    A viewset for retrieving Department objects.

    This viewset allows for retrieving all Department objects, one in particular.
    """

    # Example:
    # /api/department/ (all contacts)
    # /api/department/4/ (contact with id 4)
    # /api/department/?code=IMI (The IMI department)

    serializer_class = DepartmentSerializer

    def get_queryset(self):
        """
        Returns a queryset of all Department objects.
        """

        queryset = Department.objects.all()

        code = self.request.GET.get("code")
        if code is not None:
            queryset = queryset.filter(code=code)

        respo = self.request.GET.get("responsable")
        if respo is not None:
            queryset = queryset.filter(responsable=respo)

        return queryset


class ParcoursViewset(ReadOnlyModelViewSet):
    """
    A viewset for retrieving Parcours objects.

    This viewset allows for retrieving all Parcours objects, one in particular.
    """

    # Example:
    # /api/parcours/ (all contacts)
    # /api/parcours/4/ (contact with id 4)
    # /api/parcours/?department=IMI (The parcours from IMI dpt)

    serializer_class = ParcoursSerializer

    def get_queryset(self):
        """
        Returns a queryset of all Parcours objects.
        """

        queryset = Parcours.objects.all()
        dpt = self.request.GET.get("department")
        if dpt is not None:
            queryset = queryset.filter(department=dpt)

        return queryset


# create a view to return the parcours of a departement
# api/IMI/parcours

# api/IMI/courses

# api/IMI/VisionApprentissage/courses

# api/IMI/VisionApprentissage/courses/mandatory

# api/IMI/VisionApprentissage/courses/on_list
