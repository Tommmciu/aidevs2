package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

type Auth struct {
	Apikey string `json:"apikey"`
}
type AuthResponse struct {
	Code  int    `json:"code"`
	Msg   string `json:"msg"`
	Token string `json:"token"`
}

type TaskResponse struct {
	Code   int    `json:"code"`
	Msg    string `json:"msg"`
	Cookie string `json:"cookie"`
}

type Answer struct {
	Answer string `json:"answer"`
}

func main() {
	baseUrl := "https://zadania.aidevs.pl/"
	authPath := "token/helloapi"
	taskPath := "task/"
	answerPath := "answer/"
	requestURL := fmt.Sprintf("%s%s", baseUrl, authPath)

	authBody := Auth{
		Apikey: "feb2879b-13ec-4aaa-bcaa-ea21fa1246e1",
	}

	marshalled, _ := json.Marshal(authBody)

	res, _ := http.Post(requestURL, "application/json", bytes.NewReader(marshalled))

	fmt.Printf("client: got response!\n")
	fmt.Printf("client: status code: %d\n", res.StatusCode)

	defer res.Body.Close()
	// read body
	marshalledResponse := AuthResponse{}
	json.NewDecoder(res.Body).Decode(&marshalledResponse)
	token := marshalledResponse.Token
	fmt.Print(token)

	taskUrl := baseUrl + taskPath + token

	resp, _ := http.Get(taskUrl)
	taskResponse := TaskResponse{}
	json.NewDecoder(resp.Body).Decode(&taskResponse)

	answer := Answer{
		Answer: taskResponse.Cookie,
	}
	answerJson, _ := json.Marshal(answer)

	answerUrl := baseUrl + answerPath + token
	ansRes, _ := http.Post(answerUrl, "application/json", bytes.NewReader(answerJson))

	fmt.Print(ansRes.StatusCode)
}
