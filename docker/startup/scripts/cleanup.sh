echo "Deleting index"
curl -XDELETE http://localhost:9200/brew?pretty 

echo "Deleting template"
curl -XDELETE http://localhost:9200/_template/brew?pretty
