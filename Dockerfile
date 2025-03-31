FROM node:18


RUN mkdir /code
ADD . /code/
WORKDIR /code/packages/web
RUN npm install
CMD npm run start
