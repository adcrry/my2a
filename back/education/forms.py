from django import forms
from django.contrib import admin
from django.urls import path
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template import loader
from .models import Course
import csv

# import ExportCsvMixin


class CSVImportForm(forms.Form):
    csv_file = forms.FileField()


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    change_list_template = "templates/admin/courses_changelist.html"

    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path("import-csv/", self.import_csv),
        ]
        return my_urls + urls

    def import_csv(self, request):
        if request.method == "POST":
            csv_file = request.FILES["csv_file"]
            reader = csv.reader(csv_file)
            # Create Course objects from passed in data
            for row in csv_reader:
                Course.objects.create(
                    name=row["name"],
                    code=row["code"],
                    department=row["department"],
                    ects=row["ects"],
                    description=row["description"],
                    teacher=row["teacher"],
                    semester=row["semester"],
                    day=row["day"],
                    start_time=row["start_time"],
                    end_time=row["end_time"],
                )
            self.message_user(request, "Your csv file has been imported")
            return redirect("..")
        form = CsvImportForm()
        payload = {"form": form}
        return render(request, "admin/csv_form.html", payload)
