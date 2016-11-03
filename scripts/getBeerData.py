import requests
import json

# base_url = 'https://api.brewerydb.com/v2/search'
base_url = 'https://api.brewerydb.com/v2/beers'

# payload = {'withBreweries': 'Y',
#            'withSocialAccounts': 'N',
#            'withGuilds': 'N',
#            'withLocations': 'Y',
#            'withAlternateNames': 'N',
#            'withIngredients': 'Y',
#            'key': 'b43137df0f9192a839a5852cadc09afc',
#            'p': 1,
#            'q': 'a',
#            'format': 'json'}

payload = {'withBreweries': 'Y',
           'withSocialAccounts': 'N',
           'withIngredients': 'Y',
           'key': 'b43137df0f9192a839a5852cadc09afc',
           'p': 1,
           'format': 'json'}

r = requests.get(base_url, params=payload)

# All the data for the first page
res = json.loads(r.text)

total = res['numberOfPages']

# for i in range(ord('a'), ord('z') + 1):
#     payload['q'] = chr(i)

with open('data.txt', 'w') as outfile:
    for x in range(1, total):
        payload['p'] = x
        r = requests.get(base_url, params=payload)
        res = json.loads(r.text)
        print(res['currentPage'])
        json.dump(res, outfile)
