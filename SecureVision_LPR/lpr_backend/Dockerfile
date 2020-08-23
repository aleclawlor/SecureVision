FROM python:3.6 
ADD . /lpr_backend/ 
WORKDIR /lpr_backend

RUN pip install --upgrade pip 
RUN pip install -r requirements.txt
RUN python manage.py collectstatic --noinput
RUN python manage.py makemigrations && python manage.py migrate 
CMD gunicorn --bind 0.0.0.0:$PORT config.wsgi 

