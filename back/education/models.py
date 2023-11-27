from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth import models as models2
from django.db import models
from django.utils import timezone


class Department(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=4)
    # Responsable est un admin qui peut gérer les cours du départment (un user)
    responsable = models.OneToOneField(
        User, on_delete=models.CASCADE, null=True, blank=True
    )

    def __str__(self):
        return self.code


class Course(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10)
    department = models.OneToOneField(Department, on_delete=models.CASCADE)
    description = models.TextField(null=True, blank=True)

    class Semester(models.TextChoices):
        S3 = "S3"
        S4 = "S4"

    semester = models.CharField(max_length=10, choices=Semester.choices)

    class Day(models.TextChoices):
        LUN = "Lundi"
        MAR = "Mardi"
        MER = "Mercredi"
        JEU = "Jeudi"
        VEN = "Vendredi"

    day = models.CharField(max_length=10, choices=Day.choices)

    # horaire de début et de fin - format hh:mm (24h) France
    start_time = models.TimeField()
    end_time = models.TimeField()

    # ects -> faire *10
    _ects = models.IntegerField()

    teacher = models.CharField(max_length=100, null=True, blank=True)

    @property
    def ects(self):
        return self._ects * 10

    def __str__(self):
        return self.code


class Parcours(models.Model):
    """
    Represents a specific educational program or curriculum.
    """

    name = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    description = models.TextField(null=True, blank=True)
    courses_mandatory = models.ManyToManyField(
        Course, blank=True, related_name="mandatory_parcours"
    )
    courses_on_list = models.ManyToManyField(
        Course, blank=True, related_name="on_list_parcours"
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "parcours"


class Student(models.Model):
    user = models.OneToOneField(models2.User(), on_delete=models.PROTECT)
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    parcours = models.CharField(max_length=4, null=True, blank=True)
    department = models.ForeignKey(
        Department, on_delete=models.CASCADE, null=True, blank=True
    )

    def __str__(self):
        return self.name + " " + self.surname


# class Department(models.TextChoices):
#         IMI = "Ingénierie mathématique et informatique"
#         GCC = "Génie civil et construction"
#         GMM = "Génie mécanique et matériaux"
#         SEGF = "Sciences économiques, gestion, finance"
#         VET = "Ville, environnement, transport"
#         GI = "Génie industriel"
