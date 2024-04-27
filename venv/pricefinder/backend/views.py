from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .webdriver import *
from .serializers import *
import csv
import os

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

class SendToCSV(APIView):
    def post(self, request, format=None):
        data = request.data.get('sortedResults', [])
        name = request.data.get('csvname', 'items')

        # Define the directory path
        directory = './data/'

        # Create the directory if it doesn't exist
        if not os.path.exists(directory):
            os.makedirs(directory)

        # Define the CSV file path
        csv_file_path = f'{directory}{name}.csv'  # Replace this with your desired file path

        print(csv_file_path)

        # Define the CSV fieldnames
        fieldnames = ['id', 'name', 'price', 'rating', 'link', 'free_delivery', 'top_quality_vendor']

        try:
            # Write sortedResults to CSV
            with open(csv_file_path, mode='w', newline='') as file:
                writer = csv.DictWriter(file, fieldnames=fieldnames)
                
                # Write header
                writer.writeheader()
                
                # Write rows
                for item in data:
                    writer.writerow(item)

            return Response({"Message": "Saved to CSV"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"Error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
