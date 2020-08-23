import matplotlib.pyplot as plt 
from statistics import mode as most_frequent

test_list = ['AM15AYR', 'AM15AYR', 'AX15AVR', 'AX15AVR', 'AK15AWR', 'AW15AVR', '4H1SAVR', 'AWS9', 'AHKSAVF', 'AHKSAEF']

def caclulate_average_len(results_list):

    # avg_len = round(sum(len(result) for result in results_list)/len(results_list))
    avg_len = max([len(result) for result in results_list if len(result) < 8])

    return avg_len


def calculate_distributions(results_list, avg_len):

    res_string = ''

    for i in range(avg_len):
        curr_char_list = [result[i] for result in results_list if len(result) > i]
        res_string += most_frequent(curr_char_list)

    return res_string


# def rolling_main(results):

#     avg_len = caclulate_average_len(results)
#     res_string = calculate_distributions(results, avg_len)

#     return res_string

# print(rolling_main(test_list))