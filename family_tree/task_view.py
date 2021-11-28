from django.shortcuts import render
from rest_framework.views import APIView
from .serializer import PersonSerializer
from .models import Person
from .tasks import send_all_persons


class TaskViewPeople(APIView):
    """
    Return family, name, gender for all persons in data base
    Adn send this data to email
    """
    def get(self, request):
        peoples = Person.objects.all()
        serializer = PersonSerializer(peoples, many=True)
        people_table = []
        for d in serializer.data:
            people_table.append(f'{d["family"]} {d["name"]} {d["gender"]}')
        task = send_all_persons.delay(people_table)
        return render(request, 'family_tree/tree.pug')
