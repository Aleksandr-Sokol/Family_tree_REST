from django.urls import path
from .views import PositionView, SinglePositionView, PersonView, SinglePersonView

from . import form_view

app_name = "family_tree"

urlpatterns = [
    path('position', PositionView.as_view()),
    path('position/<int:pk>', SinglePositionView.as_view()),
    path('person', PersonView.as_view()),
    path('person/<int:pk>', SinglePersonView.as_view()),
    path('', form_view.index, name='index'),
    path('tree/', form_view.tree, name='tree'),
    # path('upload/', FileUploadView.as_view())
]
