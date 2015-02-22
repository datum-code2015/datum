{
   "_id": "_design/feeds",
   "language": "javascript",
   "views": {
       "all_feeds": {
           "map": "function(doc) {\n\tif (doc.type == 'feed') {\n\t\temit(doc.active, 1);\n\t}\n}"
       },
       "analyzed_articles_by_feed_and_date": {
           "map": "function(doc) {\n\tif (doc.type == 'article' && doc.analyzed == true) {\n\t\temit([doc.feed_id, doc.published], doc.analyzed);\n\t}\n}"
       },
       "selected_articles": {
           "map": "function(doc) {\n  if (doc.type == 'article' && doc.selected == true) {\n    emit(doc.title, doc.link);\n  }\n}"
       }
   }
}