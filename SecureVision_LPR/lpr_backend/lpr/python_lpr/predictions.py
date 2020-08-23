import os
import torch as T
import torchvision.transforms as transforms
from torch.autograd import Variable
import numpy as np 
from PIL import Image
import matplotlib.pyplot as plt 
from skimage import img_as_float, img_as_ubyte, exposure
from skimage.filters import threshold_otsu, threshold_local, gaussian, median, unsharp_mask
from skimage.io import imread, imsave
from skimage.color import rgb2gray
from datetime import datetime
import cv2
import os

from . import cnn 


current_plate_predictions = []

# function to return key for any value 
def get_key(dictionary, val): 
    for key, value in dictionary.items(): 
        if str(val) == str(value): 
             return key 

imsize = 28
loader = transforms.Compose([transforms.Scale(imsize), transforms.ToTensor()])


def image_loader(image_name):

    image = loader(image_name).float()
    image = Variable(image, requires_grad=True)
    image = image.unsqueeze(0)

    return image


def predictCharacters(characters, column_list):
        
    model = cnn.CNNNetwork(lr=0.001, batch_size=124, epochs=50, n_classes=36, load=0)
    model.load_state_dict(T.load('{base_path}/prediction_model/my_model.pth'.format(base_path=os.path.abspath(os.path.dirname(__file__))), map_location=T.device('cpu')))

    results = []
    
    for character in characters:
        
        character = rgb2gray(character)
        # character = exposure.adjust_gamma(character, .3)
        # character = median(character)
        character = gaussian(character, sigma=2)
        character = unsharp_mask(character, radius=1, amount=5)

        try: 
            thresh_val = threshold_otsu(character)
            thresh1 = thresh_val > character

        except: 
            # an unexpected error happened when trying to process the image so we break out of the function
            return 

        # _, ax = plt.subplots(1)
        # ax.imshow(thresh1, cmap="gray")
        # plt.show()

        image = img_as_ubyte(thresh1)
        # image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # ret, thresh = cv2.threshold(image, 200, 255, cv2.THRESH_BINARY)
        thresh = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)

        character = Image.fromarray(thresh)
        image = image_loader(character)

        model.eval()
        prediction = model(image)
        prediction = T.softmax(prediction, dim=1)
        classes = T.argmax(prediction, dim=1)

        item = classes[0].item()
        results.append(str(item))

    key_dict = {'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15, 'G': 16, 'H': 17, 'I': 18, 'J': 19, 'K': 20, 'L': 21, 'M': 22, 'N': 23, 'O': 24, 'P': 25, 'Q': 26, 'R': 27, 'S': 28, 'T': 29, 'U': 30, 'V': 31, 'W': 32, 'X': 33, 'Y': 34, 'Z': 35}  

    results_list = []
    for prediction in results:

        char = get_key(key_dict, prediction)
        results_list.append(char) 

    columns = column_list[:]
    column_list.sort()
    
    sorted_labels = []

    for segmentation in column_list:
        sorted_labels.append(results_list[columns.index(segmentation)])

    final_plate = ''
    for pred_label in sorted_labels:
        final_plate += pred_label


    return final_plate.lower()