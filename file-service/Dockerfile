# https://pythonspeed.com/articles/alpine-docker-python/
# https://www.digitalocean.com/community/tutorials/how-to-build-and-deploy-a-flask-application-using-docker-on-ubuntu-18-04
# https://github.com/tiangolo/meinheld-gunicorn-flask-docker
# https://hub.docker.com/r/tiangolo/meinheld-gunicorn-flask/tags
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