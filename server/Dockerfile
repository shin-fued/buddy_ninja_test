# mock_server/Dockerfile

FROM golang:1.23.4 as builder
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o server server.go

# Use Go runtime image instead of distroless
FROM golang:1.23.4 as runner
WORKDIR /app
COPY --from=builder /app/server .

EXPOSE 8080
ENTRYPOINT ["./server"]

