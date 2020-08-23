import numpy as np 
import cv2 
from skimage import img_as_ubyte, img_as_float 

# pts is a list of the 4 points specifying corners of the rectangle
# x0, x1, y0, y1
def order(pts):

    pts = np.array(pts, dtype = "float32")

    rect = np.zeros((4, 2), dtype="float32")
    
    s = pts.sum(axis = 1)
    rect[0] = pts[np.argmin(s)]
    rect[2] = pts[np.argmax(s)]

    diff = np.diff(pts, axis = 1)
    rect[1] = pts[np.argmin(diff)]
    rect[3] = pts[np.argmax(diff)]

    return rect 

def fourPointTransform(image, pts):

    rect = order(pts)
    (tl, tr, br, bl) = rect

    widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
    widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
    maxWidth = max(int(widthA), int(widthB))

    heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
    heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
    maxHeight = max(int(heightA), int(heightB))

    dst = np.array([
		[0, 0],
		[maxWidth - 1, 0],
		[maxWidth - 1, maxHeight - 1],
		[0, maxHeight - 1]], dtype = "float32")

    M = cv2.getPerspectiveTransform(rect, dst)
    warped = cv2.warpPerspective(image, M, (maxWidth, maxHeight))

    return warped

def transformMain(image, points):

    image = img_as_ubyte(image)
    transformed = fourPointTransform(image, points)
    return img_as_float(transformed)

    # img = cv2.imread('./lpr_test_datasets/license_plates_testing/I00004.png')
    # print(img.shape)
    # transformed = fourPointTransform(img, [(20, 30), (550, 30), (14, 180), (580,180)])
    # cv2.imshow('transformed', transformed)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()

# main()

