from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .webdriver import *
from .serializers import *

# Create your views here.
class ScrapeItems(APIView):
    def post(self, request, searchVal, format=None):
        scrolls = int(request.data.get('scrolls', 5))
        result = RunScraper(searchVal, scrolls)
        if result == True:
            return Response({"Message": "Successfully scraped"})
        else:
            return Response({"Message": "Shopping tab did not appear on the screen. Try the request again"})

class GetItems(APIView):
    def get(self, reqest, fomat=None):
        items = Item.objects.all()
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)