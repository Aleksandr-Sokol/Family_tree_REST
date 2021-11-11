from rest_framework import serializers
from .models import Person, Position


class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ('id', 'country', 'sity')


class PersonSerializer(serializers.ModelSerializer):
    # position = PositionSerializer(many=False, read_only=True)

    class Meta:
        model = Person
        # fields = ('id', 'name', 'family', 'position', 'mother', 'father', 'gender')
        fields = ('id', 'name', 'family', 'mother', 'father', 'gender')
        depth = 2


