package http_request

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"

	"go-crud/repository"
)

type Server struct {
	repository repository.Repository
}

func NewServer(repository repository.Repository) *Server {
	return &Server{repository: repository}
}


func (s Server) GetUser(ctx *gin.Context) {
	Logger := logrus.New()
	email,exist := ctx.Get("email")
	if !exist {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid argument email"})
		return
	}
	
	user, err := s.repository.GetUser(ctx, email.(string))
	if err != nil {
		if errors.Is(err, repository.ErrUserNotFound) {
			Logger.Error("Error in getting user",err.Error())
			ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		Logger.Error("Error in getting user",err.Error())
		ctx.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	fmt.Printf("user are here %s",user)
	ctx.JSON(http.StatusOK, gin.H{"user": user})
}

func (s Server) GetTodo(ctx *gin.Context) {
	Logger := logrus.New()
	email,exist := ctx.Get("email")
	if !exist {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid argument email"})
		return
	}
	fmt.Printf("email %s",email)
	todo, err := s.repository.GetTodo(ctx, email.(string))
	if err != nil {
		if errors.Is(err, repository.ErrUserNotFound) {
			Logger.Error("Error in getting todo",err.Error())
			ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		Logger.Error("Error in getting todo",err.Error())
		ctx.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	fmt.Printf("todos are here %v",todo)	
	ctx.JSON(http.StatusOK, todo)
}


func (s Server) CreateTodo(ctx *gin.Context) {
	Logger := logrus.New()
	var Task struct {
		ID        string `bson:"_id,omitempty" json:"_id,omitempty"`
		COMPLETED bool   `bson:"completed,omitempty" json:"completed,omitempty"`
		TASK_CONTENT string `bson:"taskContent,omitempty" json:"taskContent,omitempty"`
		DESCRIPTION string `bson:"desc,omitempty" json:"desc,omitempty"`
		EMAIL string `bson:"email,omitempty" json:"email,omitempty"`
	}
	email,exist := ctx.Get("email")
	if !exist {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid argument email"})
		return
	}
	
	if err := ctx.ShouldBindJSON(&Task); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	fmt.Printf(" todos are here %+v",Task)
	// var todo model.Todo
	// Task.ID = primitive.NewObjectID()
	Task.EMAIL = email.(string)
	
	_, err := s.repository.CreateTodo(ctx, Task)
	if err != nil {
		Logger.Error("Error in creating todo",err.Error())
		ctx.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	
	ctx.JSON(http.StatusOK, gin.H{"id": Task.ID})
}


func (s Server) UpdateTodo(ctx *gin.Context) {
	Logger := logrus.New()
	var Task struct {
		ID        string `bson:"_id,omitempty" json:"_id"`
		COMPLETED bool   `bson:"completed,omitempty" json:"completed"`
	}
	if err := ctx.ShouldBindJSON(&Task); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	if Task.ID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid argument email"})
		return
	}
// 	todoID, err := primitive.ObjectIDFromHex(id)
	user, err := s.repository.UpdateTodo(ctx, Task)
	if err != nil {
		if errors.Is(err, repository.ErrUserNotFound) {
			Logger.Error("Error in updating todo",err.Error())
			ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		Logger.Error("Error in updating todo",err.Error())
		ctx.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"user": user})
}

func (s Server) DeleteTodo(ctx *gin.Context) {
	Logger := logrus.New()
	id := ctx.Param("id")
	if id == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid argument email"})
		return
	}
	//  docId,_:= primitive.ObjectIDFromHex(id)
	if err := s.repository.DeleteTodo(ctx, id); err != nil {
		if errors.Is(err, repository.ErrUserNotFound) {
			Logger.Error("Error in deleting todo",err.Error())
			ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		Logger.Error("Error in deleting todo",err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{})
}
