from rest_framework.serializers import ModelSerializer

from education.models import Student, Course


class StudentSerializer(ModelSerializer):
    class Meta:
        model = Student
        fields = [
            "id",
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
            "code",
            "department",
            "parcours",
            "semester",
            "description",
            "teacher",
            "day",
            "start_time",
            "end_time",
            # "ects",
        ]
