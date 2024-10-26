package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Todo struct {		
	ID primitive.ObjectID `json:"_id"`
	TASK_CONTENT string `json:"taskContent"`
	INDEX  int `json:"index, omitempty"`
	DESCRIPTION string `json:"desc"`
	EMAIL string `json:"email"`
	COMPLETED bool `json:"completed"`
}
