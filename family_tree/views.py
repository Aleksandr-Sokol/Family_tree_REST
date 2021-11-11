from django.http.multipartparser import MultiPartParser
from django.shortcuts import render
from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListCreateAPIView, get_object_or_404
from rest_framework.parsers import JSONParser
from rest_framework.response import Response

from .serializer import PositionSerializer, PersonSerializer
from .models import Person, Position


def home(request):
    # return render(request, 'family_tree/home.html')
    return render(request, 'family_tree/index.pug')



class ListListObjects(ListCreateAPIView):
    '''
    Переопределяет метод create класса ListCreateAPIView
    для создания через Post запрос списка объектов
    '''
    def create(self, request, *args, **kwargs):
        many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, headers=headers)


class PositionView(ListListObjects):
    # search_fields = ['name']
    # filter_backends = (filters.SearchFilter,)
    queryset = Position.objects.all()
    serializer_class = PositionSerializer
    # permission_classes = [MyPermissions]


class SinglePositionView(RetrieveUpdateDestroyAPIView):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer
    # permission_classes = [MyPermissions]


class PersonView(ListListObjects):
    parser_classes = (JSONParser,)
    # search_fields = ['name']
    # filter_backends = (filters.SearchFilter,)
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    # permission_classes = [MyPermissions]