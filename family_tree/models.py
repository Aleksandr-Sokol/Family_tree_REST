from django.db.models import Model, CASCADE, SET_NULL, PROTECT
from django.db.models import ForeignKey, ManyToManyField
from django.db.models import CharField, EmailField, DateField, JSONField


class Human(Model):
    name = CharField(max_length=120, null=False)
    family = CharField(max_length=120, null=False)
    middle_name = CharField(max_length=120, null=True, blank=True)

    class Meta:
        abstract = True # Important


class Position(Model):
    country = CharField(max_length=120, null=False)
    sity = CharField(max_length=120, null=True)


class Person(Human):
    '''
    class for storing information about one person
    '''
    religion = CharField(max_length=120, null=True, blank=True)
    position = CharField(max_length=250)
    email = EmailField(null=True, unique=True, blank=True)
    birth_date = DateField(null=True, blank=True)
    death_date = DateField(null=True, blank=True)
    information = CharField(max_length=120, null=True, blank=True)
    gender = CharField(max_length=1,
                       choices=(('M', 'Male'), ('F', 'Female')),
                       blank=False,
                       default=None)
    position = ForeignKey(Position,
                          related_name='position',
                          on_delete=PROTECT,
                          null=True,
                          blank=True)
    mother = ForeignKey('self',
                        on_delete=SET_NULL,
                        blank=True,
                        null=True,
                        related_name='children_of_mother')
    father = ForeignKey('self',
                        on_delete=SET_NULL,
                        blank=True,
                        null=True,
                        related_name='children_of_father')
    current_spouse = ForeignKey('self',
                        on_delete=SET_NULL,
                        blank=True,
                        null=True,
                        related_name='spouse')

    # last_spouse = ManyToManyField('self',
    #                          blank=True,
    #                          null=True,
    #                          )

    # events = JSONField(blank=True,
    #                     null=True,
    #                    )

    class Meta:
        verbose_name_plural = 'Persons'

    def __str__(self):
        return f'{self.family} {self.name}'
