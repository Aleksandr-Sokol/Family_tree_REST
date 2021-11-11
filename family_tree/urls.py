from django.urls import path
from .views import PositionView, SinglePositionView, PersonView

from . import form_view


app_name = "family_tree"
# app_name will help us do a reverse look-up latter.
urlpatterns = [
    path('position/', PositionView.as_view()),
    path('person', PersonView.as_view()),
    path('position/<int:pk>', SinglePositionView.as_view()),
    path('', form_view.index, name='index'),
    # path('author/', AuthorView.as_view()),
    # path('author/<int:pk>', SingleAuthorView.as_view()),
    # path('journal/', JournalView.as_view()),
    # path('journal/<int:pk>', SingleJournalView.as_view()),
    # path('upload/', FileUploadView.as_view())
]