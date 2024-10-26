package repository

import (
	"context"
	"errors"
	"fmt"
	"go-crud/model"
	"reflect"

	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var (
	ErrUserNotFound = errors.New("user not found")
)

type Repository_ST struct {
	db *mongo.Database
}

func NewRepository(db *mongo.Database ) Repository {
	return &Repository_ST{db: db}
}


func (r Repository_ST) GetUser(ctx context.Context, email string) (model.User, error) {
	var out User
	err := r.db.
		Collection("users").
		FindOne(ctx, bson.M{"email": email}).
		Decode(&out)
		fmt.Printf("out %+v",out)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return model.User{}, ErrUserNotFound
		}
		return model.User{}, err
	}
	
	return toModel(out), nil
}

func (r Repository_ST) GetTodo(ctx context.Context, email string) ([]todo, error) {
	var todos []todo
    cursor, err := r.db.Collection("todos").Find(ctx, bson.M{"email": email})
    if err != nil {
        return nil, err 
    }
    defer cursor.Close(ctx) // Ensure the cursor is closed after processing
	

    
	// Iterate through the cursor to decode each document into the todos slice
    for cursor.Next(ctx) {
        var t todo
        if err := cursor.Decode(&t); err != nil {
            return nil, err 
        }
		
        todos = append(todos, t) // Append each decoded todo to the slice
    }
	fmt.Printf("todos are here %v",todos)
    // Check for any error that occurred during iteration
    if err := cursor.Err(); err != nil {
        return make([]todo, 0), err
    }

	if len(todos) == 0 {
        return make([]todo, 0), nil
    }
	fmt.Printf("todos are here %v",todos)
	// jsonData, err := json.Marshal(todos)
    return todos, nil // Convert and return the slice of todos
}

func (r Repository_ST) SaveUser(ctx context.Context, user model.User) ( error) {

	users, err := r.db.
		Collection("users").
		InsertOne(ctx, fromModel(user))
		fmt.Printf("users %s",users)
	if err != nil {
		return err
	}
	return nil
}

func (r Repository_ST) CreateTodo(ctx context.Context, todo allTask) (allTask, error) {
	Logger := logrus.New()
	vid := primitive.NewObjectID()
	todo.ID = vid.Hex()
	fmt.Printf("*(*(todos(()*(*()) ) %+v",reflect.TypeOf(todo.COMPLETED))
	_, err := r.db.
	Collection("todos").
	InsertOne(ctx, fromTodoModel(todo))
		
	if err != nil {
		Logger.Error("Error in creating todo",err.Error())
		return allTask{}, err
	}
	return todo, nil
}
func (r Repository_ST) UpdateTodo(ctx context.Context, task Task) (todo, error) {
	
	var result todo
	// var id,_=primitive.ObjectIDFromHex(task.ID)
	fmt.Printf("completed bool are here %+v",task.COMPLETED)
	cursor, err := r.db.
		Collection("todos").
		UpdateOne(ctx, bson.M{"_id": task.ID}, bson.M{"$set":bson.M{"completed": task.COMPLETED}})
		
		if err != nil {
			return todo{}, err
		}
		
		err = r.db.
		Collection("todos").
		FindOne(ctx, bson.M{"_id":task.ID }).
		Decode(&result)
		
	if err != nil {
		return todo{}, err
	}
	
	if cursor.MatchedCount == 0 {
		return todo{}, ErrUserNotFound
	}
	return result, nil
}


func (r Repository_ST) DeleteTodo(ctx context.Context, id string) error {
	out, err := r.db.
		Collection("todos").
		DeleteOne(ctx, bson.M{"_id": id})

	if err != nil {
		return err
	}
	fmt.Printf("out %+v",out.DeletedCount)
	// if out.DeletedCount == 0 {
	// 	return ErrUserNotFound
	// }
	return nil
}



type todo struct {		
	ID       string `bson:"_id" json:"_id"`
	TASK_CONTENT string `bson:"taskContent,omitempty" json:"taskContent,omitempty"`
	DESCRIPTION string `bson:"description,omitempty" json:"description,omitempty"`
	Email string `bson:"email,omitempty" json:"email,omitempty"`
	COMPLETED bool   `bson:"completed" json:"completed"`
}


func fromModel(in model.User) User {
	return User{
		FIRST_Name:     in.FIRST_Name,
		Email:    in.Email,
		LAST_Name:     in.LAST_Name,
		IMG_URL:  in.IMG_URL,
		LastLogin: in.LastLogin,
	}
}

func fromTodoModel(in allTask) todo {
	return todo{
		ID:in.ID,
		TASK_CONTENT:    in.TASK_CONTENT,
		DESCRIPTION:in.DESCRIPTION,
		Email: in.EMAIL,
		COMPLETED	: in.COMPLETED,
	}
}

func toModel(in User) model.User {
	return model.User{
		ID:       in.ID.String(),
		FIRST_Name: in.FIRST_Name,
		Email:    in.Email,
		LAST_Name: in.LAST_Name,
		IMG_URL:  in.IMG_URL,
		LastLogin: in.LastLogin,
	}
}
