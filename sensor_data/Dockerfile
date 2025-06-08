FROM gcc:latest

WORKDIR /app
COPY . .

RUN gcc -o data_sensor sensor_data.c -lcurl
CMD ["./data_sensor"]