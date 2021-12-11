from datetime import date, timedelta
from http import HTTPStatus

from django.test import tag
from django.contrib.auth import get_user_model, authenticate
from django.test import TestCase
from .models import Person, Position
from django.test.client import RequestFactory
from django.test import Client

@tag('autarization')
class SigninTest(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='test', password='12test12', email='test@example.com')
        self.user.save()
    def tearDown(self):
        self.user.delete()
    def test_correct(self):
        user = authenticate(username='test', password='12test12')
        self.assertTrue((user is not None) and user.is_authenticated)
    def test_wrong_username(self):
        user = authenticate(username='test', password='error')
        self.assertFalse(user is not None and user.is_authenticated)
    def test_wrong_pssword(self):
        user = authenticate(username='test', password='wrong')
        self.assertFalse(user is not None and user.is_authenticated)

person_fields = [
    'id',
    'name',
    'family'
]

@tag('autarization')
class ModelTest_01(TestCase):
    def setUp(self):
        self.position1 = Position.objects.create(country='Egipet',
                                                 sity='Dali')
        self.position2 = Position.objects.create(country='Sudan',
                                                 sity='Abusdan')
        self.person1 = Person(name='some_name',
                        family='some_family',
                        birth_date='2000-02-02',
                        gender='F',
                        position=self.position1,
                        )

        self.person2 = Person(name='name2',
                        family='family2',
                        birth_date='2000-02-02',
                        gender='M',
                        position=self.position2,
                        )

        self.person1.save()
        self.person2.save()
        self.position2.save()
        self.position1.save()

    def test_position1(self):
        self.position1.full_clean()
        self.position2.full_clean()

    def test_person1(self):
        self.person1.full_clean()
        self.person2.full_clean()

    def test_delete_person(self):
        self.person1.delete()

    def test_delete_position(self):
        self.person1.delete()
        self.position1.delete()

    def test_change_position(self):
        self.person1.position = self.position2
        self.person1.save()
        self.position1.delete()


class Request_Test_Position(TestCase):
    def setUp(self):
        self.position1 = Position.objects.create(country='Egipet', sity='Dali')
        self.c = Client()

    def test_get_position(self):
        response = self.c.get('/api/position/')
        self.assertEqual(response.status_code, HTTPStatus.OK)

    def test_get_one_position(self):
        response = self.c.get('/api/position/1')
        self.assertEqual(response.status_code, HTTPStatus.OK)

    def test_post_position(self):
        data = {
                    "country": "country 1",
                    "sity": "sity 1",
                }
        response = self.c.post('/api/position/', data=data)
        self.assertEqual(response.status_code, HTTPStatus.OK)

    def test_post_position_error(self):
        data = {"no_country": "country 1",}
        response = self.c.post('/api/position/', data=data)
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)

# class Request_Test_Person(TestCase):
#     def setUp(self):
#         self.position1 = Position.objects.create(country='Egipet', sity='Dali')
#         self.c = Client()
#
#     def test_get_position(self):
#         response = self.c.get('/api/position/')
#         self.assertEqual(response.status_code, HTTPStatus.OK)

# class TaskTest(TestCase):
#     def setUp(self):
#         self.user = get_user_model().objects.create_user(username='test', password='12test12', email='test@example.com')
#         self.user.save()
#         self.timestamp = date.today()
#
#     def get_model_fields(self, mod):
#         return mod._meta.get_fields()
#
#     def tearDown(self):
#         self.user.delete()
#
#     # def test_read_task(self):
#     #     self.assertEqual(self.person.name, 'some_name')
#
#     # def test_model(self):
#     #     fields = self.get_model_fields(self.person)
#     #     fields_name = [f.name for f in fields]
#     #     for name in person_fields:
#     #         self.assertIn(name, fields_name)
#
#
#     def test_create_position2(self):
#         self.position2 = Position(sity='Dali')
#         self.position2.save()

    #     self.assertEqual(self.task.description, 'description')
    #     self.assertEqual(self.task.due, self.timestamp + timedelta(days=1))
    # def test_update_task_description(self):
    #     self.task.description = 'new description'
    #     self.task.save()
    #     self.assertEqual(self.task.description, 'new description')
    # def test_update_task_due(self):
    #     self.task.due = self.timestamp + timedelta(days=2)
    #     self.task.save()
    #     self.assertEqual(self.task.due, self.timestamp + timedelta(days=2))