# Generated by Django 4.2.6 on 2023-12-25 16:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("education", "0007_alter_enrollment_course_alter_enrollment_student"),
    ]

    operations = [
        migrations.AlterField(
            model_name="student",
            name="parcours",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="education.parcours",
            ),
        ),
    ]
