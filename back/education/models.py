from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth import models as models2
from django.db import models
from django.utils import timezone
from .exportpdf import generate_pdf_from_courses


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

    # ects -> faire *10, prendre en compte qu'on ne compte pas les langues, -> 39 ects
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
    ) # ajouter les cours du tronc commun dedans
    courses_on_list = models.ManyToManyField(
        Course, blank=True, related_name="on_list_parcours"
    )

    class Meta:
        verbose_name_plural = "parcours"

    def __str__(self):
        return self.name


class Student(models.Model):
    user = models.OneToOneField(models2.User(), on_delete=models.PROTECT)
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    parcours = models.ForeignKey(Parcours, on_delete=models.CASCADE, null=True, blank=True)
    department = models.ForeignKey(
        Department, on_delete=models.CASCADE, null=True, blank=True
    )

    def mandatory_courses(self):
        """Return the list of mandatory courses for the student."""
        return Enrollment.objects.filter(student=self, category="mandatory")
    

    def elective_courses(self):
        """Return the list of elective courses for the student."""
        return Enrollment.objects.filter(student=self, category="elective")
        

    def check_time_table(self):
        """Return the list of compatible courses for the student."""
        student_courses = Enrollment.objects.filter(student=self)
        compatible_courses = []
        for courses in Course.objects.all():
            for s_courses in student_courses:
                if (s_courses.day == courses.day
                    and ((s_courses.course.start_time < courses.start_time and courses.start_time < s_courses.course.end_time)
                    or (s_courses.course.start_time < courses.end_time and courses.end_time < s_courses.course.end_time))):
                    break
            compatible_courses.append(courses)
            
    def count_ects(self):
        """Return the number of ects the student has."""
        student_courses = Enrollment.objects.filter(student=self)
        ects = 0
        for course in student_courses:
            ects += course.ects
        return ects
    
    def check_ects(self):
        """Return True if the student has enough ects, False otherwise."""
        return self.count_ects() >= 39
    
    def __str__(self):
        return self.name + " " + self.surname
    
    def generate_timetable(self):
        """Return the timetable of the student."""
        courses = Enrollment.objects.filter(student=self)
        courses = [{"name":course.course.code,"day":course.course.day,"start_time":course.course.start_time,"end_time":course.course.end_time} for course in courses]
        return generate_pdf_from_courses(self.name,courses)

class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    class Category(models.TextChoices):
        mandatory = "mandatory"
        elective = "elective"
        visiting = "visiting"

    category = models.CharField(max_length=10, choices=Category.choices)

    def __str__(self):
        return self.student.name + " " + self.course.code
"""
class Department(models.TextChoices):
         IMI = "Ingénierie mathématique et informatique"
         GCC = "Génie civil et construction"
         GMM = "Génie mécanique et matériaux"
         SEGF = "Sciences économiques, gestion, finance"
         VET = "Ville, environnement, transport"
         GI = "Génie industriel"
"""