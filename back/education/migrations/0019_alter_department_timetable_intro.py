# Generated by Django 4.2.6 on 2024-06-06 17:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('education', '0018_department_timetable_intro'),
    ]

    operations = [
        migrations.AlterField(
            model_name='department',
            name='timetable_intro',
            field=models.TextField(blank=True, default='', null=True),
        ),
    ]
