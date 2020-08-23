import cv2 
import numpy as np 
import time 
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from skimage import measure, img_as_ubyte, img_as_float, img_as_uint, img_as_bool, img_as_float32
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
from datetime import datetime
import os

# for string comparisons 
import string
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer 
import difflib

from . import predictions, corrections, sendResults, rollingAverage, getRegisteredPlates

prediction_stack = []
registeredPlates = []

def segmentCharactersFromPlate(plate, original_car_frame, schoolID):

    global prediction_stack
    global registeredPlates

    if len(registeredPlates) == 0:
        registeredPlates = getRegisteredPlates.getSchoolSpecificPlates(schoolID)

    clean_copy = plate.copy()

    copy = plate.copy()
    copy = img_as_ubyte(copy)

    kernel = np.array([[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]])

    testingCopy = cv2.cvtColor(copy, cv2.COLOR_BGR2GRAY)
    testingCopy = cv2.fastNlMeansDenoising(testingCopy, None, 10, 7, 21)
    testingCopy = cv2.filter2D(testingCopy, -1, kernel)

    plate = rgb2gray(plate)

    # use CV2 to get the value channel of image rather than the grayscale
    V = cv2.split(cv2.cvtColor(copy, cv2.COLOR_BGR2HSV))[2]
    T = threshold_local(testingCopy, 33, offset=8, method="gaussian")

    thresh_cv = (V > T).astype("uint8") * 255
    thresh_cv = cv2.bitwise_not(thresh_cv)
    # thresh_cv = borderFix(thresh_cv, 3)

    # label connected components on the plate
    labeled = measure.label(thresh_cv, connectivity=2, background=0)

    # char candidates mask to hold contours
    candidates = np.zeros(thresh_cv.shape, dtype="uint8")

    chars = []
    cols = []

    for label in np.unique(labeled):

        # we dont' care about the background
        if label == 0:
            continue
        
        # construct label mask to display only connected components
        labelMask = np.zeros(thresh_cv.shape, dtype="uint8")
        labelMask[labeled == label] = 255 

        contours = cv2.findContours(labelMask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        contours = contours[0]

        # ensure a contour was found in the mask
        if len(contours) > 0: 

            c = max(contours, key=cv2.contourArea)
            (x, y, w, h) = cv2.boundingRect(c)

            # get aspect ratio, solidity, and height ratio for the component
            aspectRatio = w / float(h)
            solidity = cv2.contourArea(c) / float(w*h)
            heightRatio = h/float(copy.shape[0])

            width, height = copy.shape[1], copy.shape[0]

            # put these metrics against the rules of a license plate character
            keepAspectRatio = aspectRatio < 1.0
            keepSolidity = solidity > .15
            keepHeight = heightRatio > .1 and heightRatio < .95
            
            if keepAspectRatio and keepSolidity and keepHeight and h <= .75*height:
                # compute convex hull and draw it on candidates mask
                hull = cv2.convexHull(c)
                cv2.drawContours(candidates, [hull], -1, 255, -1)
                
                # rect_border = patches.Rectangle((x, y), w, h, edgecolor="blue", linewidth=2, fill=False)
                # ax[4].add_patch(rect_border)

                roi = clean_copy[y:y+h, x: x+w]
                roi = resize(roi, (28, 28))

                chars.append(roi)
                cols.append(x)

    # for normal video
    new_result = predictions.predictCharacters(chars, cols)
    # print(new_result)
    
    if new_result in registeredPlates:
        print('Current plate {} found in DB'.format(new_result))
        sendResults.sendResults(new_result, original_car_frame, schoolID)
        return 

    try: 

        if len(new_result) == 7: 
            # sendResults(new_result, original_car_frame, schoolID)
            print(new_result)
            pass

    except(TypeError):

        pass 