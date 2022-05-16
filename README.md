# News API

This is RESTful API that delivers articles, comments and the users information.

## **Link to hosted News API** ##
https://news-api-j.herokuapp.com/api

## **This News API provides endpoints of followings** ##
- `/api/topics` 
  - Get a list of topics
- `/api/articles` 
  - Get a list of articles
  - accepts `sort_by`, `order`, `topic` query
- `/api/articles/:article_id` 
  - Get a single article with the requested article_id
- `/api/articles/:article_id/comments` 
  - Get a list of comments 
  - Post a comment
  - Delete a comment


## **To run locally** ##
 #### 1. Clone the repository  ####
 #### 2. Run `npm i`  ####
  ##### Dependencies #####
    - cors
    - dotenv
    - express
    - heroku
    - pg
  ##### Dev dependencies #####
    - husky
    - jest
    - jest-extended
    - jest-sorted
    - pg-format
    - supertest
 #### 3. **Set `.env` to link DB**  ####
 1. Create two `.env` files for your project. 
 - `.env.test` 
 - `.env.development` 
 2. Into each, add `PGDATABASE=<database_name_here>`, 
with the correct database name for that environment.
#### 4. Run script ####
- run `npm run setup-dbs`
- run `npm run seed`

#### 5. Run test ####
- run `npm test`
