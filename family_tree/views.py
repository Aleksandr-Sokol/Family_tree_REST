from django.http.multipartparser import MultiPartParser
from django.shortcuts import render
from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListCreateAPIView, get_object_or_404
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializer import PositionSerializer, PersonSerializer
from .models import Person, Position


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

    def get_queryset(self):
        params = self.request.query_params.dict()
        return super().get_queryset().filter(**params).all()


class PositionView(ListListObjects):
    search_fields = ['sity', 'id']
    # filter_backends = (filters.SearchFilter,)
    queryset = Position.objects.all()
    serializer_class = PositionSerializer


class SinglePositionView(RetrieveUpdateDestroyAPIView):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer


class PersonView(ListListObjects):
    parser_classes = (JSONParser,)
    search_fields = ['gender']
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    permission_classes = [IsAuthenticated]


class SinglePersonView(RetrieveUpdateDestroyAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    permission_classes = [IsAuthenticated]
