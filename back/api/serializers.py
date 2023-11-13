from rest_framework.serializers import ModelSerializer

from student.models import Student


class StudentSerializer(ModelSerializer):
    class Meta:
        model = Student
        fields = [
            "id",
            "name",
            "surname",
            "departement",
            "parcours",
        ]
