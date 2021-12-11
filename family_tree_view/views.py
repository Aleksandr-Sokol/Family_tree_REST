from django.shortcuts import render


def index(request):
    return render(request, 'family_tree_view/index.pug')


def tree(request):
    return render(request, 'family_tree_view/tree.pug')