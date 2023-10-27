FROM node:18-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
#CMD ["/bin/bash"]
EXPOSE 3000
