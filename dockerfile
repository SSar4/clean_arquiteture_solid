FROM node:14.18.2
WORKDIR /usr/src/msadd
COPY ./package.json .
RUN npm install --only=prod
#COPY ./dist ./dist
#EXPOSE 3000
#CMD npm start