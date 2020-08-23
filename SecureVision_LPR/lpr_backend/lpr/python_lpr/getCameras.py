import mongoConnection
from threading import Thread, Lock
from threads import runFeed


# establish a connection to the mongo db and load the cameras
database = mongoConnection.mongoConnection()
cameras = mongoConnection.getCamerasCollection(database)

# run multiple threads; one for each camera
def SingleCameraThread():
    print("Hello World")

sourceList = []
for camera in cameras:
    if camera['isActive']:
        sourceList.append(camera['source'])


runFeed('./lpr_test_videos/headOnTest.mp4')
# runFeed('./lpr_test_videos/plateTest.mp4')
# runFeed('./lpr_test_videos/rainy.mp4')