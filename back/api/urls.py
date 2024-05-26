"""
URL configuration for back project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
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

from django.contrib import admin
from django.urls import include, path
from education.views import (
    CourseViewset,
    DepartmentViewset,
    EnrollmentViewset,
    ExportStudentsView,
    ImportCourseCSV,
    ImportStudentCSV,
    ParcoursViewset,
    StudentViewset,
    TranslationView,
    ViewContractPDF,
    ParameterView
)
from rest_framework import routers

# Create a router instance
router = routers.SimpleRouter()

# Register the 'student' endpoint with the StudentViewset view
# This will generate the URL '/api/student/' for this endpoint
router.register("student", StudentViewset, basename="student")
router.register("course", CourseViewset, basename="course")
router.register("department", DepartmentViewset, basename="department")
router.register("parcours", ParcoursViewset, basename="parcours")
router.register("enrollment", EnrollmentViewset, basename="enrollment")

# ----- API -----
urlpatterns = [
    # Add the URLs generated by the router to the list of available URLs
    path("", include(router.urls)),
    path("labels/", TranslationView.as_view()),
    path("upload/course", ImportCourseCSV.as_view(), name="upload_course_csv"),
    path("upload/student", ImportStudentCSV.as_view(), name="upload_student_csv"),
    path("contract/<int:id>", ViewContractPDF.as_view(), name="contract_pdf"),
    path("students/export", ExportStudentsView.as_view(), name="export_students"),
    path("parameters", ParameterView.as_view(), name="parameters"),
]
