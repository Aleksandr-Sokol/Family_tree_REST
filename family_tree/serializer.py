from django.db.models import CharField
from rest_framework import serializers
from rest_framework.fields import Field

from .models import Person, Position

from django.core.exceptions import ObjectDoesNotExist


class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ('id', 'country', 'sity')


class PersonSerializer(serializers.ModelSerializer):
    position = PositionSerializer(many=False, read_only=False)
    mother_num = serializers.CharField(write_only=True)
    father_num = serializers.CharField(write_only=True)
    spouse_num = serializers.CharField(write_only=True)

    class Meta:
        model = Person
        fields = ('id',
                  'name',
                  'family',
                  'middle_name',
                  'position',
                  'mother',
                  'father',
                  'gender',
                  'mother_num',
                  'father_num',
                  'spouse_num',
                  )
        depth = 2

    def create(self, validated_data):
        validated_data_copy = validated_data.copy()
        position = validated_data_copy.pop('position')
        mother_id = validated_data_copy.pop('mother_num')
        father_id = validated_data_copy.pop('father_num')
        spouse_id = validated_data_copy.pop('spouse_num')
        try:
            mother = Person.objects.get(pk=mother_id)
        except ObjectDoesNotExist:
            mother = None
        try:
            father = Person.objects.get(pk=father_id)
        except ObjectDoesNotExist:
            father = None
        try:
            spouse = Person.objects.get(pk=spouse_id)
        except ObjectDoesNotExist:
            spouse = None
        position_filter = Position.objects.get_or_create(country=position['country'],
                                                         sity=position['sity'],
                                                         )
        validated_data_copy['mother'] = mother
        validated_data_copy['father'] = father
        validated_data_copy['current_spouse'] = spouse
        validated_data_copy['position'] = position_filter[0]
        person = Person.objects.create(**validated_data_copy)
        person.save()
        return person

    def update(self, instance, validated_data):
        return instance

