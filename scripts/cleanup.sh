echo "Deleting index"
curl -XDELETE http://localhost:9200/beer?pretty --user "elastic:changeme"
curl -XDELETE http://localhost:9200/brew?pretty --user "elastic:changeme"

echo "Deleting template"
curl -XDELETE http://localhost:9200/_template/beer?pretty --user "elastic:changeme"
curl -XDELETE http://localhost:9200/_template/brew?pretty --user "elastic:changeme"
