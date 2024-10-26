package config

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// MongoDBClient holds the MongoDB client instance
var MongoDBClient *mongo.Client

// Connect establishes a connection to the MongoDB database
func Connect(uri string) *mongo.Database {
    var err error
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    MongoDBClient, err = mongo.Connect(ctx, options.Client().ApplyURI(uri))
    if err != nil {
        log.Fatal(err)
    }

    // Check the connection
    err = MongoDBClient.Ping(ctx, nil)
    if err != nil {
        log.Fatal(err)
    }

    log.Println("Connected to MongoDB!")
	return MongoDBClient.Database("todos")
}

// Disconnect closes the connection to the database
func Disconnect() {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    err := MongoDBClient.Disconnect(ctx)
    if err != nil {
        log.Fatal(err)
    }
}