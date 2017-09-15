FROM mhart/alpine-node:8
## git is temporary until react-native-web gets its shit together
RUN apk add --update git && rm -rf /var/cache/apk/*
# create app directory in container
RUN mkdir -p /app/server/dist /app/public /app/models /app/config
# set /app directory as default working directory
WORKDIR /app
# only copy package.json initially so that `RUN yarn` layer is recreated only
# if there are changes in package.json
ADD package.json yarn.lock /app/
# --pure-lockfile: Don’t generate a yarn.lock lockfile
RUN yarn --pure-lockfile --production
# copy build from build stage to /app in container
COPY ./server/dist ./server/dist
COPY ./public ./public
COPY ./models ./models
COPY ./config ./config
EXPOSE 4040
CMD ["yarn", "serve"]