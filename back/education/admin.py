from django.contrib import admin

from .models import Student, Course, Department, Parcours, Enrollment


class StudentAdmin(admin.ModelAdmin):
    search_fields = ["name", "surname", "department__name", "parcours__name"]
    list_filter = ["department", "parcours"]
    list_display = ["name", "surname", "department", "parcours"]


class CourseAdmin(admin.ModelAdmin):
    search_fields = ["name", "code", "department__name"]
    list_filter = ["department", "semester", "day"]
    list_display = ["name", "code", "department"]


class ParcoursAdmin(admin.ModelAdmin):
    search_fields = ["name", "department__name"]
    list_filter = ["department"]
    list_display = ["name", "department"]


admin.site.register(Student, StudentAdmin)
admin.site.register(Course, CourseAdmin)
admin.site.register(Department)
admin.site.register(Enrollment)
admin.site.register(Parcours, ParcoursAdmin)
