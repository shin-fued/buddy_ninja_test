package main

import (
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type Telemetry struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Datetime  string  `json:"datetime"`
	Battery   int     `json:"battery"`
}

type Telemetries struct {
	DataArray []Telemetry `json:"telemetryData"`
}

var telemetryData Telemetries

func uploadData(c echo.Context) error {
	var data Telemetry
	if err := c.Bind(&data); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid data"})
	}
	telemetryData.DataArray = append(telemetryData.DataArray, data)
	log.Printf("📡 Received data: %+v\n", data)
	log.Printf("Received: %+v\n", data)
	return c.JSON(http.StatusOK, map[string]string{"status": "received"})
}

func viewHandler(c echo.Context) error {
	return c.JSON(http.StatusOK, telemetryData)
}

func main() {
	e := echo.New()
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{echo.GET, echo.POST},
	}))
	e.POST("/upload", uploadData)
	e.GET("/view", viewHandler)
	log.Println("Starting server on :8080")
	e.Logger.Fatal(e.Start(":8080"))
}
