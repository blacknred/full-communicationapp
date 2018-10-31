FROM node:alpine

# set working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
ADD package.json /usr/src/app/package.json
RUN npm install
RUN npm install -g react-scripts@1.1.5

# Volume configuration
#VOLUME ["/usr/src/app", "/usr/src/package.json"]

# start app
CMD ["npm", "start"]
