import numpy as np
from skimage import measure, img_as_ubyte, img_as_float 
from skimage.measure import regionprops
from skimage.segmentation import mark_boundaries, watershed
from skimage.feature import canny, peak_local_max
from skimage.morphology import disk, closing, opening, dilation, erosion
from skimage.filters import median, threshold_otsu, unsharp_mask
from skimage.color import label2rgb, rgb2gray
from skimage.restoration import denoise_bilateral
from scipy.ndimage import distance_transform_edt 
import matplotlib.pyplot as plt 
import matplotlib.patches as patches
import cv2 

# function used to fix border in another file
# from testing import borderFix

def fixPerspective(source):
    
    original = source.copy()
    img = unsharp_mask(source, radius=40, amount=20)

    # # initialize matplot lib plots
    # fig, axes = plt.subplots(nrows=4, ncols=2, figsize=(8, 8), sharex=True, sharey=True)
    # ax = axes.ravel()

    # perform thresholding on image and then convert to arr of float to process in scikit-image 
    thresh_val = threshold_otsu(img, 29)
    thresh_img = img > thresh_val
    # thresh_img = borderFix(thresh_img, 3)
    
    # watershed algorithm for segmentation 
    # edges = canny(img_scikit, sigma=3.0)

    # dt = distance_transform_edt(~edges)
    # local_max = peak_local_max(dt, indices=False, min_distance=10)
    # markers = measure.label(local_max)
    # labels = watershed(-dt, markers)

    labeled = measure.label(thresh_img)

    # we only care about the largest area in this frame
    regions_max = max([region.area for region in regionprops(labeled)])

    # by default result is the original plate if nothing else is found 
    result = source

    for region in regionprops(labeled):
        
        y0, x0, y1, x1 = region.bbox 
        h, w = img.shape

        # logically the plate should be the largest segmentation and take up at least 65% of the frame
        # but sometimes the entire frame is read as the biggest
        if region.area != regions_max:
            continue
        
        # roi = img[y0:y1, x0:x1]
        image = region.image

        # rect_border = patches.Rectangle((x0, y0), x1 - x0, y1 - y0, edgecolor="red", linewidth=2, fill=False)
        # ax[2].add_patch(rect_border)

        pts1 = np.float32([[x0, y0], [x1, y0], [x0, y1], [x1, y1]])
        pts2 = np.float32([[0, 0], [w, 0], [0, h], [w, h]])

        perspectiveMatrix = cv2.getPerspectiveTransform(pts1, pts2)
        # result = cv2.warpPerspective(img_as_ubyte(image), perspectiveMatrix, (w, h))
        # result = rgb2gray(img_as_float(result))

        # return result

    # # comment out below when running main program
    # ax[0].imshow(img, cmap="gray")
    # ax[1].imshow(thresh_img, cmap="gray")
    # ax[1].imshow(labeled, cmap="nipy_spectral", alpha=.7)
    # ax[2].imshow(thresh_img, cmap="gray")
    # ax[3].imshow(roi, cmap="gray")
    # ax[4].imshow(image, cmap="gray")
    # ax[5].imshow(result, cmap="gray")

    # for a in ax:
    #     a.axis('off')
    
    # fig.tight_layout()
    # plt.show()
    # #########################################

    return result

    # w, h = img.shape
    # transformed = cv2.warpPerspective(img, perspectiveMatrix, (w, h))

    # cv2.imshow('labeled', img_label_overlay)
    # cv2.waitKey(0)

    # cv2.imshow('fixed', result)
    # cv2.waitKey(0)

def debugging(): 
    
    #angle434.png

    # source = './thresh_plates/angles{}.png'.format(434)
    source = './thresh_plates/headOn{}.png'.format(29)

    fixPerspective(source)

# debugging()