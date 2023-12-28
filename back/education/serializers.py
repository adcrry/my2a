from rest_framework import serializers

from .models import Student, Course, Department, Parcours, Enrollment


class StudentSerializer(serializers.ModelSerializer):
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


class CourseSerializer(serializers.ModelSerializer):
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


class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = [
            "id",
            "student",
            "course",
            "category",
        ]
    
    course = CourseSerializer()


class CompleteStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            "id",
            "user",
            "name",
            "surname",
            "department",
            "parcours",
            "ects",
            "mandatory_courses",
            "elective_courses"
        ]

    mandatory_courses = EnrollmentSerializer(many=True)
    elective_courses = EnrollmentSerializer(many=True)
    ects = serializers.SerializerMethodField()

    def get_ects(self, obj):
        return obj.count_ects()


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = [
            "id",
            "name",
            "code",
            "responsable",
        ]


class ParcoursSerializer(serializers.ModelSerializer):
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

