import cv2 
import numpy as np 
import time 
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from skimage import measure, img_as_ubyte, img_as_float
from skimage.measure import regionprops
from skimage.morphology import disk, binary_erosion, binary_dilation, binary_opening, binary_closing, erosion, dilation, closing, opening, skeletonize, thin 
from skimage.io import imread, imsave
from skimage.filters import threshold_otsu, threshold_local, threshold_li, threshold_mean, threshold_minimum, gaussian, threshold_yen, rank, unsharp_mask, try_all_threshold, median, sobel, roberts
from skimage.color import rgb2gray, label2rgb
from skimage.transform import resize
from skimage.segmentation import watershed
from skimage.restoration import denoise_bilateral
from skimage.feature import canny, peak_local_max
from skimage.exposure import adjust_gamma, adjust_log
from scipy.ndimage import distance_transform_edt, convolve, binary_fill_holes, label
import numpy as np 
import imutils
import time
import os

from . import localizePlate, characterSegmentation, lpr_test_videos

offsets = {
    'normal': {
        'vertical_offset': 44,
        'horizontalMargin': 100
    },
    'garage': {
        'vertical_offset': 24,
        'horizontalMargin': 100
    }
}

# safety_range = num pixels up from center = num pixels down from center
safety_ranges = {
    'normal': 32,
    'garage': 20
}

# global bbox coordinates used to show the license plate being located in each image 
x_plate, y_plate, w_plate, h_plate = 0, 0, 0, 0
previous_frame = None

def bbox_callback(ret_x, ret_y, ret_w, ret_h):

        global x_plate, y_plate, w_plate, h_plate
        x_plate, y_plate, w_plate, h_plate = ret_x, ret_y, ret_w, ret_h


def runFeed(source, video_type, schoolID):

    global x_plate, y_plate, w_plate, h_plate, previous_frame

    cap = cv2.VideoCapture(source)

    while True:

        ret, frame = cap.read()
        frame_copy = frame.copy()

        frame_copy_safety = frame.copy()

        frame_copy = img_as_float(frame_copy)
        frame_copy_safety = img_as_float(frame_copy_safety)
 
        # convert to RGB so we can work with scikit image
        frame_RGB = img_as_float(frame)
        frame_grayscaled = rgb2gray(frame_RGB)
        
        thresh_value =  threshold_local(frame_grayscaled, 29) 
        thresh = frame_grayscaled > thresh_value

         # convert back to BGR so we can show in OpenCV
        img_cv = img_as_ubyte(thresh)

        copy = frame.copy()
        frame_grayed = cv2.cvtColor(copy, cv2.COLOR_BGR2GRAY)

        # configure area that picks up license plates 
        vertical_offset  = offsets[video_type]['vertical_offset']
        horizontalMargin = offsets[video_type]['horizontalMargin']

        # define plate area coordinates
        h, w = frame.shape[0], frame.shape[1]
        x0, y0, x1, y1 = horizontalMargin, int(h/2) - vertical_offset, w-horizontalMargin, int(h/2) + vertical_offset
        
        if video_type == 'garage': 
            y0 += 40
            y1 -= 20

        if video_type == 'normal':
            y0 -= 50
            x0 += 50
            x1 -= 20

        safety_range = safety_ranges[video_type]

        safety_areas = {
            'normal': (150, int(h/2) - safety_range - 52, w - 120, int(h/2) + safety_range - 52),
            'garage':(240, int(h/2) - safety_range + 100, w - 170, int(h/2) + safety_range + 90)
        }

        x0_safety, y0_safety, x1_safety, y1_safety = safety_areas[video_type]

        # create an image out of the area of the video frame we want to analyze 
        img_cv = cv2.rectangle(frame, (x0, y0), (x1, y1), (255, 0, 0), 4)
        img_safety = cv2.rectangle(img_cv, (x0_safety, y0_safety), (x1_safety, y1_safety), (0, 0, 255), 2)
        
        localizePlate.localize(img_as_float(frame_copy[y0: y1, x0: x1]), video_type, frame_copy, bbox_callback, schoolID)
        characterSegmentation.segmentCharactersFromPlate(img_as_float(frame_copy[y0_safety: y1_safety, x0_safety: x1_safety]), frame_copy, schoolID)

        previous_frame = frame

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()


def main():

    # currently in development; use real camrea urls for production 
    runFeed('{base_path}/lpr_test_videos/headOnTest.mp4'.format(base_path=os.path.abspath(os.path.dirname(__file__))), 'normal', '5e2e054aa4c496228bca8850') 


