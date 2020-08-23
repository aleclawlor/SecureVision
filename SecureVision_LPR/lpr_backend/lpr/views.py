from django.shortcuts import render
from django.http import HttpResponse

from datetime import datetime

from . import python_lpr as lpr 
from lpr.python_lpr import main 

def landing(request):

    print(lpr)
    submit(request)

    main.main()

    return render(request, 'cameras/cameras.html')


def debug(request):
    # submit(request)
    
    return HttpResponse('<h1>LPR Debugging</h1>')


def submit(request):
    print("Submitted Button")


