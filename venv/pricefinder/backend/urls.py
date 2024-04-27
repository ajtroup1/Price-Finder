from django.urls import path
from .views import *

urlpatterns = [
    path('items', GetItems.as_view()),
    path('runscraper/<str:searchVal>', ScrapeItems.as_view()),
    path('sendtocsv', SendToCSV().as_view()),
]