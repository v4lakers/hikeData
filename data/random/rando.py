import math
import random
from bottle import route, run, template, static_file, request
from collections import Counter
import pandas as pd
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from geopy.geocoders import Nominatim




# Get Data
scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
creds = ServiceAccountCredentials.from_json_keyfile_name('HikeAnalytics-037073e9d447.json', scope)
gc = gspread.authorize(creds)


zips = pd.read_csv("../zips/zips.csv")
geolocator = Nominatim(timeout=30)

# Yet to Visit
wks2 = gc.open('Hikes').worksheet('YetToVisit')
yet_to_visit = wks2.get_all_values()
headers = yet_to_visit.pop(0)
data_yet_to_visit = pd.DataFrame(yet_to_visit, columns=headers)

locations = []

for index, row in data_yet_to_visit.iterrows():

    country = row["Location"].split(", ")[-1].lower()

    if country == "us":
        info = zips.loc[zips["Zip"] == int(row["Zip"])]
        lat1 = math.radians(info["Latitude"])
        lon1 = math.radians(info["Longitude"])

    else:
        loc = geolocator.geocode(row["Location"] + ", " + row["Zip"])
        lat1 = math.radians(loc.latitude)
        lon1 = math.radians(loc.longitude)

    lat2 = math.radians(37.299474)
    lon2 = math.radians(-121.75446)

    dlon = lon2 - lon1
    dlat = lat2 - lat1

    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = 6373.0 * c

    if distance <= 150:
        locations.append(row["Name"])



@route('/')
def hello():
    return template('home.html')

# Results of albums based on search criteria
@route('/results.html')
def results():

    print(locations)

    nam1 = request.query.nam1
    nam2 = request.query.nam2

    cleo1 = request.query.cleo1
    cleo2 = request.query.cleo2

    kelly1 = request.query.kelly1
    kelly2 = request.query.kelly2

    paul1 = request.query.paul1
    paul2 = request.query.paul2

    vivek1 = request.query.vivek1
    vivek2 = request.query.vivek2

    charles1 = request.query.charles1
    charles2 = request.query.charles2

    trails = [nam1,nam2,cleo1,cleo2,kelly1,kelly2,paul1,paul2,vivek1,vivek2, charles1, charles2]
    count = Counter(trails)

    trail = random.choice(trails)
    if trail == "" or trail == "random":
        trail = random.choice(locations)

    return template('results.html', Trail=trail, Counts=count)


run(host='localhost', port=8080, debug=True)



