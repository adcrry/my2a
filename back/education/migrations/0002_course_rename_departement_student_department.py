# Generated by Django 4.2.6 on 2023-11-13 14:32

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("education", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Course",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("code", models.CharField(max_length=4)),
                (
                    "department",
                    models.CharField(
                        choices=[
                            ("Ingénierie mathématique et informatique", "Imi"),
                            ("Génie civil et construction", "Gcc"),
                            ("Génie mécanique et matériaux", "Gmm"),
                            ("Sciences économiques, gestion, finance", "Segf"),
                            ("Ville, environnement, transport", "Vet"),
                            ("Génie industriel", "Gi"),
                        ],
                        max_length=50,
                    ),
                ),
                ("parcours", models.CharField(max_length=4)),
                ("description", models.TextField()),
                (
                    "semester",
                    models.CharField(
                        choices=[("Semestre 3", "S3"), ("Semestre 4", "S4")],
                        max_length=10,
                    ),
                ),
                (
                    "day",
                    models.CharField(
                        choices=[
                            ("Lundi", "Lun"),
                            ("Mardi", "Mar"),
                            ("Mercredi", "Mer"),
                            ("Jeudi", "Jeu"),
                            ("Vendredi", "Ven"),
                        ],
                        max_length=10,
                    ),
                ),
                ("start_time", models.TimeField()),
                ("end_time", models.TimeField()),
                ("ects", models.IntegerField()),
                ("teacher", models.CharField(max_length=100)),
            ],
        ),
        migrations.RenameField(
            model_name="student",
            old_name="departement",
            new_name="department",
        ),
    ]
