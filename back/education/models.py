from django.db import models


class Student(models.Model):
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    department = models.CharField(max_length=4)
    parcours = models.CharField(max_length=4)


# class Departement(models.Model):
#     # name is the name of the department (e.g. "Génie civil et construction")
#     # code is the code of the department (e.g. "GCC")
#     # select among the choices of the Department class
#     name = models.CharField(max_length=100, choices=Department.choices)
#     code = models.CharField(max_length=4, choices=Department.choices)


class Course(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=4)

    class Department(models.TextChoices):
        IMI = "Ingénierie mathématique et informatique"
        GCC = "Génie civil et construction"
        GMM = "Génie mécanique et matériaux"
        SEGF = "Sciences économiques, gestion, finance"
        VET = "Ville, environnement, transport"
        GI = "Génie industriel"

    department = models.CharField(max_length=50, choices=Department.choices)
    parcours = models.CharField(max_length=4)
    description = models.TextField()

    class Semester(models.TextChoices):
        S3 = "Semestre 3"
        S4 = "Semestre 4"

    semester = models.CharField(max_length=10, choices=Semester.choices)

    class Day(models.TextChoices):
        LUN = "Lundi"
        MAR = "Mardi"
        MER = "Mercredi"
        JEU = "Jeudi"
        VEN = "Vendredi"

    day = models.CharField(max_length=10, choices=Day.choices)

    # horaire de début et de fin
    start_time = models.TimeField()
    end_time = models.TimeField()

    # ects -> faire *10
    _ects = models.IntegerField()

    teacher = models.CharField(max_length=100)

    @property
    def ects(self):
        return self._ects * 10
