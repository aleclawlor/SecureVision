import numpy as np 
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
from datetime import datetime as time 

# threading libraries 
import threading
import concurrent.futures
from queue import Queue

from . import fourPointTransform, characterSegmentation

queue_lock = threading.Lock()
q = Queue()

# function provided to each thread 
def localizeThread(roi, original_car_frame, schoolID, alertNewLicensePlate):
    return character_segmentation(roi, original_car_frame, schoolID, alertNewLicensePlate)

# try to localize a plate within the frame returned from the designated area 
def localize(plate_area, video_type, original_car_frame, callback, schoolID):

    plate_copy = plate_area.copy()

    img = rgb2gray(plate_area)
    sharpened = unsharp_mask(img, radius=3, amount=20)

    thresh_value = threshold_otsu(sharpened)
    thresh = thresh_value < sharpened

    labels = measure.label(thresh)

    # different videos have different 'requirements' for a plate object

    plate_dimensions_dictionary = {
        'normal': (.015*img.shape[0], .4*img.shape[0], .015*img.shape[1], .4*img.shape[1]),
        'garage': (.2*img.shape[0], .8*img.shape[0], .05*img.shape[1], .2*img.shape[1]),
        'angles': (.2*img.shape[0], .9*img.shape[0], .1*img.shape[1], .9*img.shape[1])      # angles has a much wider range of angles, widths, and heights
    }   

    plate_dimensions = plate_dimensions_dictionary[video_type]
    min_height, max_height, min_width, max_width = plate_dimensions
    
    threads = []

    for region in regionprops(labels):

        # eliminate areas that are just noise
        if region.area < 100:
            continue

        y0, x0, y1, x1 = region.bbox

        region_height = y1 - y0 
        region_width = x1 - x0 
        
        # a license plate must be wider than it is tall 
        if region_height > region_width:
            continue

        if region_height >= min_height and region_height <= max_height and region_width >= min_width and region_width <= max_width:

            # callback(x0, y0, region_width, region_height)

            rect_border = patches.Rectangle((x0, y0), x1 - x0, y1 - y0, edgecolor="blue", linewidth=2, fill=False)
            # ax[4].add_patch(rect_border)
            
            # plate = plate_copy[y0:y1, x0:x1]
            # imsave('./plate_frames/plate{}.png'.format(time.now()), img_as_ubyte(plate))

            roi = plate_copy[y0: y1, x0: x1]
            points = [(x0, y0), (x1, y0), (x0, y1), (x1, y1)]

            # create a new thread for the current detected plate to speed up performance 
            with concurrent.futures.ThreadPoolExecutor() as executor: 
                f1 = executor.submit(localizeThread, roi, original_car_frame, schoolID, alertNewLicensePlate)
                print(f1.result() if len(f1.result()) == 7)


