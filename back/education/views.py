from django.shortcuts import render, redirect, get_object_or_404
from django.template import loader
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from .models import Student, Course, Department, Parcours, Enrollment
from .serializers import (
    StudentSerializer,
    CourseSerializer,
    DepartmentSerializer,
    ParcoursSerializer,
    EnrollmentSerializer,
)
from rest_framework.decorators import action

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
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """
        Returns the current user.
        """
        student = get_object_or_404(Student, user=request.user)
        serializer = StudentSerializer(student)
        return Response(serializer.data)
    

    @action(detail=False, methods=['post'], url_path="current/department")
    def set_department(self, request):
        """
        Set current user department.
        """

        student = get_object_or_404(Student, user=request.user)
        department = get_object_or_404(Department, code=request.data["department"])
        student.department = department
        student.save()
        serializer = StudentSerializer(student)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], url_path="current/parcours")
    def set_parcours(self, request):
        """
        Set current user parcours.
        """
        student = get_object_or_404(Student, user=request.user)
        parcours = get_object_or_404(Parcours, id=request.data["parcours"])
        student.parcours = parcours
        student.save()
        serializer = StudentSerializer(student)
        return Response(serializer.data)

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

class EnrollmentViewset(ReadOnlyModelViewSet):
    """
    A viewset for retrieving Enrollment objects.

    This viewset allows for retrieving all Enrollment objects, one in particular.
    """

    # Example:
    # /api/enrollment/ (all contacts)
    # /api/enrollment/4/ (contact with id 4)

    serializer_class = EnrollmentSerializer

    def get_queryset(self):
        """
        Returns a queryset of all Enrollment objects.
        """

        queryset = Enrollment.objects.all()
        return queryset

class PostDepartment(APIView):
    """
    API endpoint to select a department
    """
    def post(self,request):
        department = get_object_or_404(Department,name=request.data["department"])
        student = Student.objects.get(user__id=request.user.id)
        student.department = department
        student.save()

class PostParcours(APIView):
    """
    API endpoint to select a parcours
    """
    def post(self,request):
        parcours = get_object_or_404(Parcours,name=request.data["parcours"])
        student = Student.objects.get(user__id=request.user.id)
        student.parcours = parcours
        student.save()

class PostEnrollment(APIView):
    """
    API endpoint to select courses
    """
    def post(self,request):
        for course in request.data["courses"]:
            get_object_or_404(Course,name=course)
            student = Student.objects.get(user__id=request.user.id)
            enrollment = Enrollment(student=student,course=course)
            enrollment.save()

