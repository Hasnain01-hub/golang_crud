package config

import (
	"log"

	"github.com/joho/godotenv"
)

func init(){
	err := godotenv.Load() // Load .env file
    if err != nil {
        log.Fatal("Error loading .env file")
    }
}