import pymongo
from pymongo import MongoClient 
import ssl

def getSchoolSpecificPlates(schoolID):

    cluster = MongoClient("mongodb+srv://aleclawlor:Alec18Lawlor@cluster0-iqxlt.mongodb.net/test?retryWrites=true&w=majority", ssl=True, ssl_cert_reqs=ssl.CERT_NONE)
    db = cluster["test"]

    highRisk = db["highriskplates"]
    parents = db["parentplates"]

    allPlates = []

    for highRiskPlate in highRisk.find({"schoolID": schoolID}):
        allPlates.append(highRiskPlate['plateNumber'])

    for parentPlate in parents.find({"schoolID": schoolID}): 
        allPlates.append(parentPlate['plateNumber'])

    return allPlates 


getSchoolSpecificPlates('5e2e054aa4c496228bca8850')