from rest_framework import serializers
from .models import Person, Position


class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ('id', 'country', 'sity')


class PersonSerializer(serializers.ModelSerializer):
    position = PositionSerializer(many=False, read_only=False)

    class Meta:
        model = Person
        fields = ('id', 'name', 'family', 'position', 'mother', 'father', 'gender')
        depth = 2

    def create(self, validated_data):
        validated_data_copy = validated_data.copy()
        position = validated_data_copy.pop('position')
        position_filter = Position.objects.get_or_create(country=position['country'],
                                                         sity=position['sity'],
                                                         )
        validated_data_copy['position'] = position_filter[0]
        person = Person.objects.create(**validated_data_copy)
        person.save()
        return person

    def update(self, instance, validated_data):
        return instance

