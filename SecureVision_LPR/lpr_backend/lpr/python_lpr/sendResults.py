import pymongo
from pymongo import MongoClient
import ssl
import base64
from datetime import datetime
from datetime import date
from bson.objectid import ObjectId

# sends license plate read to mongo
cluster = MongoClient("mongodb+srv://aleclawlor:Alec18Lawlor@cluster0-iqxlt.mongodb.net/test?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs=ssl.CERT_NONE)
database = cluster["test"]

unrecognizedDB = database["unrecognizedplates"]
parentsDB = database["parentplates"]
highriskDB = database["highriskplates"]
regularFeed = database["generalfeeds"]

# create a user template to be posted to db 
parentCriminalTemplate = {
    'name': None,
    'plateNumber': None,
    'type': None,
    'location': None, 
    'date': None,
    'time': None,
    'imageData': None 
}

def sendResults(plateNumber, original_car_frame, schoolID):

    isParent = parentsDB.find_one({"plateNumber": plateNumber, "schoolID":schoolID})
    isCriminal = highriskDB.find_one({"plateNumber": plateNumber, "schoolID":schoolID})

    if isParent:

        print(isParent)
        # print("Parents plate recognized")

        body = parentCriminalTemplate
        body['name'] = isParent['parentName']
        body['plateNumber'] = plateNumber
        body['type'] = 'Parent'
        body['location'] = 'Parking Lot'
        body['date'] = date.today().strftime("%m/%d/%y")
        body['time'] = datetime.now().strftime("%H:%M:%S")
        body['_id'] = ObjectId()
        body['schoolID'] = schoolID

        try:
            regularFeed.insert_one(body)
            return 

        except: 
            print("couldn't post to general feed")
            return 


    if isCriminal:

        print(isCriminal)
        print("High risk plate found")
        
        body = parentCriminalTemplate

        body['name'] = isCriminal['name']
        body['plateNumber'] = plateNumber
        body['type'] = isCriminal['type']
        body['location'] = 'Parking Lot'
        body['date'] = date.today().strftime("%m/%d/%y")
        body['time'] = datetime.now().strftime("%H:%M:%S")
        body['_id'] = ObjectId()
        body['schoolID'] = schoolID
        # body['imageData'] =  base64.b64encode(original_car_frame)

        try: 
            regularFeed.insert_one(body)
            return 

        except:
            print("couldn't upload to regular feed")
            return


    # at this point we know this isn't a parent plate or criminal plate so it must be unrecognized
    found = unrecognizedDB.find_one({"plateNumber": plateNumber})

    # current plate isn't in the database; insert it 
    if found == None or found:

        # send the prediction to the database
        postData = {"plateNumber": plateNumber, "location": 'Parking Lot',  "date": date.today().strftime("%m/%d/%y"), "time": datetime.now().strftime("%H:%M:%S"), "entryNumber": 1, "schoolID": schoolID}

        try:
            unrecognizedDB.insert_one(postData)
            print("Successfully posted unrecognized license plate to database")
            return 

        except: 
            print("There was an error posting to the database")
            return 

        return 

    # update the 'entryNumber,' 'date,' and 'time' values of the current plate
    else:

        try:
            unrecognizedDB.update_one({"_id": found['_id']}, {"$set": {"entryNumber": found['entryNumber'] + 1, "date": date.today().strftime("%m/%d/%y"), "time": datetime.now().strftime("%H:%M:%S"), "schoolID": schoolID}})
            # print("Current value updated")

        except:
            print("There was an error posting to the database")
            return 

        return 

