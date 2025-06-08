FROM gcc:latest

RUN apt-get update && apt-get install -y libcurl4-openssl-dev

WORKDIR /app
COPY . .

RUN gcc -o data_sensor sensor_data.c -lcurl
CMD ["./data_sensor"]