\c nc_news_test
-- SELECT * From articles
-- WHERE articles.topic = 'mitch';

-- SELECT articles.*
-- FROM articles;

-- FULL JOIN comments ON articles.article_id = comments.article_id;



  -- SELECT articles.*,
  --       COUNT(comments.comment_id) AS comment_count
  --       FROM articles
  --       LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.topic ILIKE 'cats'
  --       GROUP BY articles.article_id;
  --       -- ORDER BY created_at DESC;


  SELECT * FROM comments WHERE article_id=1 ORDER BY created_at ;
