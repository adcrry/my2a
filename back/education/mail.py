from education.models import Parameter
from templated_email import send_templated_mail


def get_department_admins(department):
    """Return the list of admins for a department."""
    return [p.value for p in Parameter.objects.filter(name=department.code + "_admin")]


def send_confirmation_mail(student):
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
        },
        cc=get_department_admins(student.department),
    )
