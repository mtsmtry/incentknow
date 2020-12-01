
import sys
from flask import escape

import requests
import json
import datetime as dt
import time
import os
import traceback
import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage

firebase_admin.initialize_app()
bucket = storage.bucket('incentknow-crawling')

def setAuth(json):
    json["auth"] = "c95b763282404389a6024a9d6a55f53f576c442746c44fccbf7490679b29d129"

def callFunction(functionName, data):
    url = "https://asia-northeast1-incentknow.cloudfunctions.net/"
    json = { "data": data }
    response = requests.post(url + functionName, json=json)
    print(response.json())
    return response.json()["result"]

def getTaskIds(task):
    return { "crawlerId": task["crawlerId"], "operationId": task["operationId"], "taskId": task["taskId"] }

def beginCrawlingTask(task):
    json = getTaskIds(task)
    setAuth(json)
    return callFunction("beginCrawlingTask", json)

def completeCrawlingTask(task, indexes, contents):
    json = getTaskIds(task)
    json["indexes"] = indexes
    json["contents"] = contents
    setAuth(json)
    return callFunction("completeCrawlingTask", json)

def failedCrawlingTask(task, phase, message):
    json = getTaskIds(task)
    json["phase"] = phase
    json["message"] = message
    setAuth(json)
    return callFunction("failedCrawlingTask", json)

def executeTask(task):
    print(task)
    if not beginCrawlingTask(task):
        return

    # fetch
    html = ""
    try:
        cacheBlob = bucket.blob(task["crawlerId"] + "/" + task["cacheId"])
        if task["method"] == "crawling":
            response = requests.get(task["url"]) 
            response.encoding = "utf-8"
            html = response.text
            cacheBlob.upload_from_string(html)
        elif task["method"] == "SCRAPING":
            html = cacheBlob.download_as_string()
    except:
        msg = traceback.format_exc()
        print(msg)
        failedCrawlingTask(task, msg, "fetching")
        return
    # scrape
    output = {}
    try:
        exec(task["scrapingCode"], globals())
        output = scrape(html)
    except:
        msg = traceback.format_exc()
        print(msg)
        failedCrawlingTask(task, msg, "scraping")
        return True
    # complete
    completeCrawlingTask(task, output["indexes"] or [], output["contents"] or [])

def subscribeCrawlingTask(event, context):
    """Background Cloud Function to be triggered by Pub/Sub.
    Args:
         event (dict):  The dictionary with data specific to this type of
         event. The `data` field contains the PubsubMessage message. The
         `attributes` field will contain custom attributes if there are any.
         context (google.cloud.functions.Context): The Cloud Functions event
         metadata. The `event_id` field contains the Pub/Sub message ID. The
         `timestamp` field contains the publish time.
    """
    import base64

    print("""This Function was triggered by messageId {} published at {}
    """.format(context.event_id, context.timestamp))

    data = base64.b64decode(event['data']).decode('utf-8')
    task = json.loads(data)
    executeTask(task)