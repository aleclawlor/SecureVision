from skimage import measure, img_as_ubyte, img_as_float

# help reduce connections of license plate numbers to license plate borders
def borderFix(plate, pixels):

    i = 1 
    rows = len(plate)
    newPlate = []

    for row in plate:

        new_row = []
        pos = 0

        for pixel in row:

            if i <= pixels or i > rows-pixels or pos <= pixels or pos >= plate.shape[1] - pixels:
                new_row.append(False)
            else:
                new_row.append(True)

            pos += 1

        i += 1
        newPlate.append(new_row)

    return img_as_float(newPlate)


def darken(plate):

    new_image = []

    for row in plate:
        new_row = []
        for pixel in row:
            # print(pixel)
            if pixel > 1.4:
                new_row.append(15)
            else: 
                new_row.append(pixel)
        new_image.append(new_row)

    return img_as_float(new_image)