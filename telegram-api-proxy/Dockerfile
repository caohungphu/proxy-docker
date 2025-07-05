FROM node:18-slim

WORKDIR /app

COPY proxy.js .

RUN npm init -y && npm install http

EXPOSE 8080

# Command to run the application
CMD ["node", "proxy.js"]