package http_request

import (
	"context"
	"encoding/json"
	"fmt"
	"go-crud/config"
	_ "go-crud/config"
	"go-crud/model"
	"go-crud/repository"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var (
    googleOauthConfig = oauth2.Config{
        RedirectURL:  "http://localhost:8000/api/auth/googleRedirect",
        ClientID:     os.Getenv("CLIENT_ID"),
        ClientSecret: os.Getenv("CLIENT_SECRET"),
        Scopes: []string{
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        },
        Endpoint: google.Endpoint,
    }
    oauthStateString = "random"
    REQUESTURL = "http://localhost:3000"
)


func HandleGoogleLogin(ctx *gin.Context) {
    fmt.Print("HandleGoogleLogin")
    url := googleOauthConfig.AuthCodeURL(oauthStateString)
    ctx.Redirect( http.StatusTemporaryRedirect,url )
}
type UserInfo struct {
    Email string `json:"email"`
    FIRST_Name string `json:"given_name"`
    LAST_Name string `json:"family_name"`
    IMG_URL string `json:"picture"`

    // Add other fields as needed
}

func  HandleGoogleCallback(ctx *gin.Context) {
    state := ctx.Request.FormValue("state")
    if state != oauthStateString {
        http.Error(ctx.Writer, "invalid oauth state", http.StatusBadRequest)
        return 
    }

    code := ctx.Request.FormValue("code")
    token, err := googleOauthConfig.Exchange(context.Background(), code)
    if err != nil {
        http.Error(ctx.Writer, "could not get token", http.StatusBadRequest)
        return 
    }

    client := googleOauthConfig.Client(context.Background(), token)
    resp, err := client.Get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token="+ fmt.Sprint(token.AccessToken))
    if err != nil {
        http.Error(ctx.Writer, "could not create request", http.StatusBadRequest)
        return 
    }
    defer resp.Body.Close()
    
        
    var userInfo UserInfo
    
    if err := json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
    http.Error(ctx.Writer, "could not decode response", http.StatusInternalServerError)
    return 
    }
    fmt.Printf( "Response: %+v", userInfo)
    claims := &repository.Claims{
        Email:  userInfo.Email,
        StandardClaims: jwt.StandardClaims{
            // ExpiresAt: jwt.NewNumericDate(expirationTime),
            ExpiresAt: time.Now().Add(time.Hour * 1).Unix(), 
            IssuedAt:   time.Now().Unix(),
            Subject:   userInfo.Email,
        },
    }
    jwt_token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

    // Sign the token with the secret key
    var tokenString, tokenErr = jwt_token.SignedString([]byte(os.Getenv("JWT_SECRET")))
    
    if tokenErr != nil {
        http.Error(ctx.Writer, "could not get token", http.StatusBadRequest)
        return 
    }
    
    
    // ctx.JSON(http.StatusOK, gin.H{"user": tokenString})
    cookie := &http.Cookie{
        Name:     "jwt",
        Value:    tokenString,
        Path:     "/", // The path for which the cookie is valid
        // Expires:  time.Now().Add(24 * time.Hour), // Set expiration to 24 hours
        // HttpOnly: true, // Prevents JavaScript access to the cookie
    }
    db:=config.Connect(os.Getenv("MONGO_URI"))
    repo := repository.NewRepository(db) // Create an instance of Repository_ST
    
    user,_ := repo.GetUser(ctx, userInfo.Email)
    fmt.Printf("user Email %+v",user)
    if (user.Email==userInfo.Email){ 
      http.SetCookie(ctx.Writer, cookie)
    ctx.Redirect(http.StatusFound, REQUESTURL)
    return 
    }

    var errs error=repo.SaveUser(ctx, model.User{
    // ID: primitive.NewObjectID(),
    Email: userInfo.Email,
    LAST_Name: userInfo.LAST_Name,
    FIRST_Name: userInfo.FIRST_Name,
    IMG_URL: userInfo.IMG_URL,
    LastLogin: time.Now(),
})
    config.Disconnect() 
// fmt.Printf( "jwt stirng: %s", primitive.NewObjectID())
if errs!=nil{
    http.Error(ctx.Writer, "could save user", http.StatusBadRequest)
    return 
}

    // Set the cookie in the response
    http.SetCookie(ctx.Writer, cookie)
    ctx.Redirect(http.StatusFound, REQUESTURL)
    
}