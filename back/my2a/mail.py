from education.models import Parameter
from templated_email import send_templated_mail
from celery import shared_task
from education.models import Student

def get_department_admins(department):
    """Return the list of admins for a department."""
    return [p.value for p in Parameter.objects.filter(name=department.code + "_admin")]

@shared_task(name="send_confirmation_mail")
def send_confirmation_mail(studentId):
    student = Student.objects.get(id=studentId) 
    mandatory_count = 0
    elective_count = 0
    parcours_count = 0
    for course in student.mandatory_courses():
        mandatory_count += course.course.ects
    for course in student.elective_courses():
        elective_count += course.course.ects
    for course in student.parcours.courses_mandatory.all():
        parcours_count += course.ects

    send_templated_mail(
        template_name="confirmation",
        from_email="my2a@enpc.org",
        recipient_list=[student.user.email],
        context={
            "student": student,
            "parcours_name": student.parcours.name,
            "mandatory_courses": student.parcours.courses_mandatory.all(),
            "onlist_courses": student.mandatory_courses(),
            "elective_courses": student.elective_courses(),
            "mandatory_count": mandatory_count,
            "elective_count": elective_count,
            "parcours_count": parcours_count,
            "total_count": mandatory_count + elective_count + parcours_count + student.parcours.academic_base_ects + student.parcours.base_ects,
        },
        cc=get_department_admins(student.department),
    )

@shared_task(name="send_account_creation_mail")
def send_account_creation_mail(mail, first_name, last_name, password):
    send_templated_mail(
        template_name="creation",
        from_email="my2a@enpc.org",
        recipient_list=[mail],
        context={
            "first_name": first_name,
            "last_name": last_name,
            "password": password,
        },
    )

@shared_task(name="send_modification_mail")
def send_account_status_change_mail(mail, first_name, last_name):
    send_templated_mail(
        template_name="modification",
        from_email="my2a@enpc.org",
        recipient_list=[mail],
        context={
            "first_name": first_name,
            "last_name": last_name,
        },
    )