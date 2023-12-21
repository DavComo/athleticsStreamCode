import sys
import os
import requests
import json

acronym = input("Enter the acronym of the school you want to add (MIS, ZIS, etc.): ")
"""logoPath = input("Enter the absolute path to the logo of the school you want to add: ")

if not os.path.exists(logoPath):
    print("Invalid path to logo. Fix and try again.")
    sys.exit(0)
else:
    os.system(f"cp {logoPath} ./CommonUse/{acronym}_Logo-200x200.png")"""

with open('streamData.js') as dataFile:
    data = dataFile.read()
    obj = data[data.find('{') : data.rfind('}')+1]
    jsonObj = json.loads(obj)

aws_access_key = jsonObj['accessKey']
aws_secret_key = jsonObj['secretKey']
table_name = jsonObj['dbName']
dynamodb_endpoint = f"https://dynamodb.{jsonObj['awsRegion']}.amazonaws.com"

# Replace this with the primary key and attributes of the item you want to add
items_data = [
    {
        'valueId': 'primaryColors',
        acronym.lower(): '#000000',
    },
    {
        'valueId': 'secondaryColors',
        acronym.lower(): '#000000',
    },
]

url = f'{dynamodb_endpoint}/dynamodb/latest/{table_name}'

headers = {
    'Content-Type': 'application/x-amz-json-1.0',
    'X-Amz-Target': 'DynamoDB_20120810.BatchWriteItem',
}

put_requests = [
    {
        'PutRequest': {
            'Item': {key: {'S': str(value)} for key, value in item_data.items()},
        }
    }
    for item_data in items_data
]

payload = {
    'RequestItems': {
        table_name: put_requests,
    }
}

auth = (aws_access_key, aws_secret_key)
print(auth)
response = requests.post(
    url,
    headers=headers,
    auth=auth,
    data=json.dumps(payload),
)

# Print the response
print(response.status_code)
print(response.json())


