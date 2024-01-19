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
    created_rows = []  # List to store rows that were created
    print("--- Creating courses:")
    for row in csv_reader:
        try:
            code = row["code"]
            print("------ " + f"Course code: {code}")

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

            # catch : Field 'ects' expected a number but got 'a'.
            try:
                ects = int(ects)
            except ValueError:
                print("------ " + f"Ects {ects} is not a valid number")
                error_rows.append(
                    [
                        row["code"],
                        "Le nombre de crédits '"
                        + ects
                        + "' n'est pas valide. Veuillez d'utiliser un nombre.",
                    ]
                )
                continue

            # Check if department with the given code exists
            try:
                department = Department.objects.get(code=department_code)
            except Department.DoesNotExist:
                print("------ " + f"Department {department_code} does not exist")
                error_rows.append(
                    [
                        row["code"],
                        "Le département '" + department_code + "' n'existe pas",
                    ]
                )
                continue

            if semester not in ["S3", "S4"]:
                print("------ " + f"Semester {semester} does not exist")
                error_rows.append(
                    [
                        row["code"],
                        "Le semestre '"
                        + semester
                        + "' n'existe pas. Veuillez utiliser 'S3' ou 'S4'",
                    ]
                )
                continue
            # Match semester name to semester value
            semester_mapping = {
                "S3": Course.Semester.S3,
                "S4": Course.Semester.S4,
            }
            semester = semester_mapping.get(semester)

            if day not in ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"]:
                print("------ " + f"Day {day} does not exist")
                error_rows.append(
                    [
                        row["code"],
                        "Le jour '"
                        + day
                        + "' n'existe pas. Veuillez utiliser 'Lundi', 'Mardi', 'Mercredi', 'Jeudi' ou 'Vendredi'",
                    ]
                )
                continue

            # Match day name to day value
            day_mapping = {
                "Lundi": Course.Day.LUN,
                "Mardi": Course.Day.MAR,
                "Mercredi": Course.Day.MER,
                "Jeudi": Course.Day.JEU,
                "Vendredi": Course.Day.VEN,
            }

            day = day_mapping.get(day)

            # # Si start_time et end_time ne sont pas des heures (devrait être accepté -> 8:30, 15:45)
            # if start_time < "00:00" or start_time > "23:59":
            #     print("------ " + f"Start time {start_time} is not a valid time")
            #     error_rows.append(
            #         [
            #             row["code"],
            #             "L'heure de début '"
            #             + start_time
            #             + "' n'est pas valide. Veuillez d'utiliser le format 'hh:mm'",
            #         ]
            #     )
            #     continue

            # if end_time < "00:00" or end_time > "23:59":
            #     print("------ " + f"End time {end_time} is not a valid time")
            #     error_rows.append(
            #         [
            #             row["code"],
            #             "L'heure de fin '"
            #             + end_time
            #             + "' n'est pas valide. Veuillez d'utiliser le format 'hh:mm'",
            #         ]
            #     )
            #     continue

            # if start_time > end_time:
            #     print(
            #         "------ " + f"Start time {start_time} is after end time {end_time}"
            #     )
            #     error_rows.append(
            #         [
            #             row["code"],
            #             "L'heure de début '"
            #             + start_time
            #             + "' est après l'heure de fin '"
            #             + end_time
            #             + "'",
            #         ]
            #     )
            #     continue

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

            created_rows.append(row["code"])  # Add row to created list
            print("------ " + f"Course {course} created")

        except Exception as e:
            print(e)
            error_rows.append([row["code"], e])  # Add row to error list

    return error_rows, created_rows


# def importCourseCSV(csv_file):
#     print("prout")
