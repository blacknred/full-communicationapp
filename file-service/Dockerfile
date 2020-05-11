# https://pythonspeed.com/articles/alpine-docker-python/
FROM python:3.8-slim-buster

# install and cache app dependencies
COPY requirements.txt /
RUN pip install -r /requirements.txt

ENV STATIC_URL /static

# set working directory
# COPY . /app
# WORKDIR /app
RUN mkdir -p /usr/src/app
WORKDIR /usr/src

# start app
CMD ["gunicorn", "-w 4", "main:app"]