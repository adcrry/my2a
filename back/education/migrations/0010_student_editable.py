# Generated by Django 4.2.6 on 2024-01-08 14:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('education', '0009_alter_course_department'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='editable',
            field=models.BooleanField(default=True),
            preserve_default=False,
        ),
    ]
