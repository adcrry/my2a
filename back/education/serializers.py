from rest_framework.serializers import ModelSerializer

from .models import Student, Course, Department, Parcours


class StudentSerializer(ModelSerializer):
    class Meta:
        model = Student
        fields = [
            "id",
            "user",
            "name",
            "surname",
            "department",
            "parcours",
        ]


class CourseSerializer(ModelSerializer):
    class Meta:
        model = Course
        fields = [
            "id",
            "name",
            # Info pour la scolarité
            "code",
            "department",
            "ects",
            # Info détails
            "description",
            "teacher",
            # Info sur l'horaire
            "semester",
            "day",
            "start_time",
            "end_time",
        ]


class DepartmentSerializer(ModelSerializer):
    class Meta:
        model = Department
        fields = [
            "id",
            "name",
            "code",
            "responsable",
        ]


class ParcoursSerializer(ModelSerializer):
    class Meta:
        model = Parcours
        fields = [
            "id",
            "name",
            "department",
            "description",
            "courses_mandatory",
            "courses_on_list",
        ]
