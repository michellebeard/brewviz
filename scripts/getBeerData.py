import requests
import json

payload = {'search': {'withBreweries': 'Y',
                      'withSocialAccounts': 'N',
                      'withGuilds': 'N',
                      'withLocations': 'Y',
                      'withAlternateNames': 'N',
                      'withIngredients': 'Y',
                      'key': 'b43137df0f9192a839a5852cadc09afc',
                      'p': 1,
                      'q': 'a',
                      'format': 'json'},
           'beers': {'withBreweries': 'N',
                     'withSocialAccounts': 'N',
                     'withIngredients': 'Y',
                     'key': 'b43137df0f9192a839a5852cadc09afc',
                     'p': 1,
                     'format': 'json'}}


def getBeer(base_url="", payload=dict, prefix=""):
    # All the data for the first page
    r = requests.get(base_url, params=payload)
    res = json.loads(r.text)
    total = res['numberOfPages']
    ext = '.json'

    for x in range(1, total + 1):
        fmt = "%04d" % (x)
        filename = prefix + "-" + fmt + ext
        with open(filename, 'w') as outfile:
            payload['p'] = x
            r = requests.get(base_url, params=payload)
            res = json.loads(r.text)
            print(res['currentPage'])
            json.dump(res['data'], outfile)
            outfile.write('\n')


if __name__ == '__main__':
    beers_url = 'https://api.brewerydb.com/v2/beers'
    search_url = 'https://api.brewerydb.com/v2/search'
    styles_url = 'https://api.brewerydb.com/v2/styles'

    getBeer(beers_url, payload["beers"], "data/beers")
