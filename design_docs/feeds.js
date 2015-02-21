{
   "_id": "_design/feeds",
   "_rev": "1-558a517a8ecb9e7a86fcd53350cd53cb",
   "language": "javascript",
   "views": {
       "all_feeds": {
           "map": "function(doc) {\n\tif (doc.type == 'feed') {\n\t\temit(doc.active, 1);\n\t}\n}"
       }
   }
}