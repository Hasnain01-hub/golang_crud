package model

import (
	"time"
)


type User struct {
	ID       string `json:"_id"`
	FIRST_Name     string `json:"firstName"`
	LAST_Name     string `json:"lastName"`
	IMG_URL  string `json:"imgURL"`
	LastLogin time.Time `json:"lastLogin"`
	Email    string `json:"email"`
}
