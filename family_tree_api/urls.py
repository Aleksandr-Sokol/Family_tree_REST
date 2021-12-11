from django.urls import path
from .views import PositionView, SinglePositionView, PersonView, SinglePersonView
from .task_view import TaskViewPeople

app_name = "family_tree_api"

urlpatterns = [
    path('position', PositionView.as_view()),
    path('position/<int:pk>', SinglePositionView.as_view()),
    path('person', PersonView.as_view()),
    path('person/<int:pk>', SinglePersonView.as_view()),
    # path('', form_view.index, name='index'),
    # path('tree/', form_view.tree, name='tree'),
    path('send_peoples', TaskViewPeople.as_view(), name='send_peoples'),
    # path('upload/', FileUploadView.as_view())
]
