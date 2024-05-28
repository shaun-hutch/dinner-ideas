import boto3
from enum import Enum
from models import DinnerItem

# define the DynamoDB table that Lambda will connect to
tableName = "dinner-ideas-table"

# create the DynamoDB resource
dynamo = boto3.resource('dynamodb').Table(tableName)

def create(item):

    print(item)
    response = dynamo.put_item(**item)

    print(response)

class FoodTag(Enum):
    Quick = "Quick"
    Vegeterian = "Vegeterian"
    Vegan = "Vegan"
    GlutenFree = "Gluten Free"
    Cheap = "Cheap"
    LowCarb = "Low Carb"
    FamilyFriendly = "Family Friendly"