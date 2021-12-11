from django.urls import path
from . import views

app_name = "family_tree_view"

urlpatterns = [
    path('', views.index, name='index'),
    path('tree/', views.tree, name='tree'),
    ]
