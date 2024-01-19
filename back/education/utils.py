import csv
from io import TextIOWrapper  # Import TextIOWrapper for handling file decoding

from django.contrib import admin
from django.shortcuts import redirect, render
from django.urls import path
from django.urls.conf import include

from .models import Course, Department, Parcours, Student


def importCourseCSV(csv_file):
    print("--- Reading CSV file...")
    csv_file_wrapper = TextIOWrapper(
        csv_file.file, encoding="utf-8"
    )  # Use TextIOWrapper for decoding
    csv_reader = csv.DictReader(csv_file_wrapper, delimiter=";")

    # Create Course objects from passed-in data
    error_rows = []  # List to store rows with errors
    print("--- Creating courses:")
    for row in csv_reader:
        try:
            code = row["code"]

            # Check if course with the same code already exists
            if Course.objects.filter(code=code).exists():
                print("------ " + f"Course with code {code} already exists")
                error_rows.append([row["code"], "Un cours avec ce code existe déjà"])
                continue

            name = row["name"]
            department_code = row[
                "department"
            ]  # Change variable name to department_code
            ects = row["ects"]
            description = row["description"]
            teacher = row["teacher"]
            semester = row["semester"]
            day = row["day"]
            start_time = row["start_time"]
            end_time = row["end_time"]

            # Check if department with the given code exists
            try:
                department = Department.objects.get(code=department_code)
            except Department.DoesNotExist:
                print("------ " + f"Department {department_code} does not exist")
                error_rows.append(
                    [row["code"], "Le département " + department_code + " n'existe pas"]
                )
                continue

            # Match semester name to semester value
            semester_mapping = {
                "S3": Course.Semester.S3,
                "S4": Course.Semester.S4,
            }
            semester = semester_mapping.get(semester)

            # Match day name to day value
            day_mapping = {
                "Lundi": Course.Day.LUN,
                "Mardi": Course.Day.MAR,
                "Mercredi": Course.Day.MER,
                "Jeudi": Course.Day.JEU,
                "Vendredi": Course.Day.VEN,
            }

            day = day_mapping.get(day)

            print(f"Department value from CSV: {department}")
            print(f"Semester value from CSV: {semester}")
            print(f"Day value from CSV: {day}")

            course = Course(
                name=name,
                code=code,
                department=department,
                ects=ects,
                description=description,
                teacher=teacher,
                semester=semester,
                day=day,
                start_time=start_time,
                end_time=end_time,
            )
            course.save()

            print("------ " + f"Course {course} created")

        except Exception as e:
            print(e)
            error_rows.append([row["code"], e])  # Add row to error list

    return error_rows


# def importCourseCSV(csv_file):
#     print("prout")
