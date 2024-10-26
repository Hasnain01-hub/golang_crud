package main

import (
	"context"
	"log"
	"os"
	"time"

	_ "go-crud/config"
	"go-crud/http_request"
	"go-crud/repository"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"

	// cors "github.com/rs/cors/wrapper/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// create a database connection
	client, err := mongo.NewClient(options.Client().ApplyURI(os.Getenv("MONGO_URI")))
	if err != nil {
		log.Fatal(err)
	}
	logger := logrus.New()
	logger.SetFormatter(&logrus.JSONFormatter{})
	if err := client.Connect(context.TODO()); err != nil {
		log.Fatal(err)
	}
	router := gin.Default()
	router.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000"},
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Content-Type", "Authorization", "authtoken"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true, // Allows cookies or auth tokens
        MaxAge: 24 * time.Hour,  // Cache the preflight response for 24 hours
    }))



	// create a repository
	repository := repository.NewRepository(client.Database("todos"))

	// create an http server
	server := http_request.NewServer(repository)
	
	// create a gin router
	
	api := router.Group("/api")
	{
		authRoute := api.Group("/auth")
		{
			authRoute.GET("/current_user",repository.JWTMiddleware(), server.GetUser)
			authRoute.GET("/login/google", http_request.HandleGoogleLogin)
			authRoute.GET("/googleRedirect", http_request.HandleGoogleCallback)
	}

		api.GET("/gettodo", repository.JWTMiddleware(),server.GetTodo)
		api.POST("/createtodo", repository.JWTMiddleware(),server.CreateTodo)
		api.POST("/updateTodo", repository.JWTMiddleware(),server.UpdateTodo)
		api.GET("/deletetodo/:id", repository.JWTMiddleware(),server.DeleteTodo)
		
	}

	// start the router
	router.Run(":8000")
}
