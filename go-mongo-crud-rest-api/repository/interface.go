package repository

import (
	"context"
	"time"

	"go-crud/model"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Repository interface {
	GetUser(ctx context.Context, email string) (model.User, error)
	CreateTodo(ctx context.Context, todo allTask) (allTask, error)
	UpdateTodo(ctx context.Context, task Task) (todo, error)
	GetTodo(ctx context.Context, email string) ([]todo, error)
	DeleteTodo(ctx context.Context, id string) error
	SaveUser(ctx context.Context, user model.User) ( error)
	JWTMiddleware() gin.HandlerFunc
}

type User struct {
	ID       primitive.ObjectID `bson:"_id" json:"_id"`
	FIRST_Name     string             `bson:"firstName,omitempty" json:"firstName,omitempty"`
	LAST_Name     string             `bson:"lastName,omitempty" json:"lastName,omitempty"`
	Email    string             `bson:"email,omitempty" json:"email,omitempty"`
	IMG_URL  string             `bson:"imgURL,omitempty" json:"imgURL,omitempty"`
	LastLogin time.Time          `bson:"lastLogin,omitempty" json:"lastLogin,omitempty"`

}

type Task struct {
	ID        string `bson:"_id,omitempty" json:"_id"`
	COMPLETED bool   `bson:"completed,omitempty" json:"completed"`
}

type allTask struct {
	ID        string `bson:"_id,omitempty" json:"_id,omitempty"`
	COMPLETED bool   `bson:"completed,omitempty" json:"completed,omitempty"`
	TASK_CONTENT string `bson:"taskContent,omitempty" json:"taskContent,omitempty"`
	DESCRIPTION string `bson:"desc,omitempty" json:"desc,omitempty"`
	EMAIL string `bson:"email,omitempty" json:"email,omitempty"`
}