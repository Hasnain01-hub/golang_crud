package repository

import (
	"fmt"
	_ "go-crud/config"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)
var JwtSecret = []byte(os.Getenv("JWT_SECRET"))
type Claims struct {
    Email    string `json:"email"`
     jwt.StandardClaims
}

// Middleware for JWT verification
func (r *Repository_ST) JWTMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        tokenString := c.Request.Header.Get("authtoken")
        
        if tokenString == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is missing"})
            c.Abort()
            return
        }

        // Parse and validate the token
        token, err :=  jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
            // Validate the algorithm
            if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
                return nil, http.ErrNotSupported
            }
            return JwtSecret, nil
        })
        

        if err != nil || !token.Valid {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }
        claims, ok := token.Claims.(*Claims)
        if !ok {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Could not parse claims"})
            c.Abort()
            return
        }
        fmt.Printf("claims are here %s",claims.Email)
        // Store user details in the context for later use
        c.Set("email", claims.Email)

        // Token is valid; proceed with the request
        c.Next()
    }
}