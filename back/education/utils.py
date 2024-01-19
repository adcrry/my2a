import csv
from io import TextIOWrapper  # Import TextIOWrapper for handling file decoding

from django.contrib import admin
from django.shortcuts import redirect, render
from django.urls import path
from django.urls.conf import include


# def importCourseCSV(csv_file):
#     # Lire le fichier csv
#     # Pour chaque ligne du fichier csv, créer un objet Course et l'ajouter à la base de données
#     csv_file_wrapper = TextIOWrapper(
#         csv_file.file, encoding="utf-8"
#     )  # Use TextIOWrapper for decoding
#     csv_reader = csv.DictReader(csv_file_wrapper)

#     # Create Course objects from passed-in data
#     error_rows = []  # List to store rows with errors
#     for row in csv_reader:
#         try:
#             Course.objects.create(
#                 name=row["name"],
#                 code=row["code"],
#                 department=row["department"],
#                 ects=row["ects"],
#                 description=row["description"],
#                 teacher=row["teacher"],
#                 semester=row["semester"],
#                 day=row["day"],
#                 start_time=row["start_time"],
#                 end_time=row["end_time"],
#             )
#         except Exception as e:
#             error_rows.append(row)  # Add row to error list

#     self.message_user(request, "Your csv file has been imported")
#     return redirect(".."), error_rows


def importCourseCSV(csv_file):
    print("prout")
