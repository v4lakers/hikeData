import random
import folium
import zipcodes
import pandas as pd
import gspread
from oauth2client.service_account import ServiceAccountCredentials


def adjust():
    with open("data/style/script.js", "r") as infile:
        data = infile.readlines()

    with open("test.js", "w") as outfile:
        counter = 0
        locations = []
        for line in data:
            if "// ChartActionHere" in line:
                locations.append(counter + 1)
            counter = counter + 1


def getData():
    # Get Data
    scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
    creds = ServiceAccountCredentials.from_json_keyfile_name('hiking-bbfdb156f948.json', scope)
    gc = gspread.authorize(creds)

    # Visited
    wks1 = gc.open('hike_data').worksheet('Visited')
    visited = wks1.get_all_values()
    headers = visited.pop(0)
    data_visited = pd.DataFrame(visited, columns=headers)


    return data_visited


def map(data_visited):
    zips = pd.read_csv("data/zips/zips.csv")
    unique_zips = []
    counties = []
    cities = []
    states = []

    map_of_hikes = folium.Map(
        location=[34.9, -118.8863],
        tiles='Stamen Terrain',
        zoom_start=6,
        zoom_control=True,
        left=75
    )

    for index, row in data_visited.iterrows():
        country = row["Location"].split(", ")[-1].lower()

        epsilon = 0
        if row["Zip"] not in unique_zips:
            unique_zips.append(row["Zip"])
            if zipcodes.matching(row["Zip"])[0]['county'] not in counties:
                counties.append(zipcodes.matching(row["Zip"])[0]['county'])
        else:
            epsilon = epsilon + random.uniform(0, 1) / 100

        if country == "us":
            info = zips.loc[zips["Zip"] == int(row["Zip"])]
            lat = info["Latitude"] + epsilon
            lon = info["Longitude"] + epsilon

        else:
            # loc = geolocator.geocode(row["Location"] + ", " + row["Zip"])
            # lat = loc.latitude
            # lon = loc.longitude
            pass

        text = row["Name"] + "\t" + "Date: " + str(row["Date"]) + "\t" + "Length: " + str(row["Length"])
        folium.Marker(location=[lat, lon],
                      icon=folium.Icon(color='lightred'),
                      popup=folium.Popup(text, max_width=100)
                      ).add_to(map_of_hikes)


    map_of_hikes.save("temp.html")

    with open("map.html", "w") as infile:

        with open("header.html", "r") as outfile1:
            for line in outfile1:
                infile.write(line)

        with open("temp.html", "r") as outfile2:
            for line in outfile2:
                infile.write(line)

    infile.close()
    outfile1.close()
    outfile2.close()

    return len(unique_zips), len(counties)


def line_graph(metric, metric_name):
    values = []
    dates = []

    for row in metric.iterrows():
        temp = str(row[1]).split("\n")
        values.append(float(temp[0].split(" ")[-1]))
        dates.append(row[0].strftime('%b-%Y'))

    if metric_name == "Miles" or metric_name == "Efficiency":
        with open("data/style/script.js", "r") as infile:
            data = infile.readlines()
        infile.close()

        with open("data/style/script.js", "w") as outfile:
            counter = 0
            for i in range(len(data)):
                if metric_name == "Miles":
                    if "var labels5 =" in data[i]:
                        data[counter] = "var labels5 = " + str(dates) + "\n"

                    if "var data5 = " in data[i]:
                        data[counter] = "var data5 = " + str(values) + "\n"
                if metric_name == "Efficiency":
                    if "var labels6 =" in data[i]:
                        data[counter] = "var labels6 = " + str(dates) + "\n"

                    if "var data6 = " in data[i]:
                        data[counter] = "var data6 = " + str(values) + "\n"

                outfile.write(data[i])
                counter = counter + 1
        outfile.close()


def trailing(data):
    data['Date'] = pd.to_datetime(data['Date'])
    data["Length"] = pd.to_numeric(data["Length"])
    data["Elevation_Gain"] = pd.to_numeric(data["Elevation_Gain"])
    data["Efficiency"] = pd.to_numeric(data["Efficiency"])
    data["Time"] = pd.to_numeric(data["Time"])

    miles = data.groupby(data['Date'].dt.to_period("M"))['Length'].sum().to_frame()
    eff = data.groupby(data['Date'].dt.to_period("M"))['Efficiency'].median().to_frame()
    line_graph(miles, "Miles")
    line_graph(eff, "Efficiency")


def sums(data, zips, counties):
    miles = round(pd.to_numeric(data["Length"]).sum(), 1)
    elevation = round(pd.to_numeric(data["Elevation_Gain"]).sum(), 1)
    minutes = round(pd.to_numeric(data["Time"]).sum(), 1)
    hikes = len(data.index)



    with open("index.html", "r") as infile:
        data = infile.readlines()
    infile.close()

    with open("index.html", "w") as outfile:
        for i in range(len(data) - 1):
            if ">Miles</p>" in data[i + 1]:
                data[i] = "<h3>" + f"{miles:,}" + "</h3>" + "\n"
            if ">Elevation Gain</p>" in data[i + 1]:
                data[i] = "<h3>" + f"{elevation:,}" + "</h3>" + "\n"
            if ">Minutes</p>" in data[i + 1]:
                data[i] = "<h3>" + f"{minutes:,}" + "</h3>" + "\n"
            if ">Hikes</p>" in data[i + 1]:
                data[i] = "<h3>" + str(hikes) + "</h3>" + "\n"
            if ">Zip Codes</p>" in data[i + 1]:
                data[i] = "<h3>" + str(zips) + "</h3>" + "\n"
            if ">Counties</p>" in data[i + 1]:
                data[i] = "<h3>" + str(counties) + "</h3>" + "\n"

            outfile.write(data[i])
        outfile.write(data[len(data) - 1])

    outfile.close()



def bubble(data):
    datasets = []
    mile_sum = round(pd.to_numeric(data["Length"]).sum(), 1)
    miles = [mile_sum, 100-mile_sum]
    hike_sum = len(data.index)
    hikes = [hike_sum, 50-hike_sum]
    data["Output"] = pd.to_numeric(data["Output"])
    max_miles = float(max(pd.to_numeric(data["Length"])))
    max_elev = float(max(pd.to_numeric(data["Elevation_Gain"])))
    for index, row in data.iterrows():
        temp = {}
        if max_miles == float(row["Length"]) or max_elev == float(row["Elevation_Gain"]):

            inside = {'backgroundColor': 'rgb(75, 192, 192)', 'data': 0, 'label': ""}
        else:
            inside = {'backgroundColor': 'rgb(255, 99, 132)', 'data': 0, 'label': ""}

        temp['r'] = float(row["Time"])/20
        temp['y'] = float(row["Elevation_Gain"])
        temp['x'] = float(row["Length"])
        inside['data'] = [temp]
        inside['label'] = [row["Name"]+" "+str(row["Date"].date())]
        datasets.append(inside)


    years = []
    vals = []
    bar = data.groupby(data['Date'].dt.to_period("Y"))['Output'].sum().to_frame()
    for row in bar.iterrows():
        temp = str(row[1]).split("\n")
        vals.append(float(temp[0].split(" ")[-1]))
        years.append(row[0].strftime('%Y'))


    with open("data/style/script.js", "r") as infile:
        data = infile.readlines()
    infile.close()

    with open("data/style/script.js", "w") as outfile:
        for i in range(len(data)):
            if "var data3 = " in data[i]:
                data[i] = "var data3 = " + str(datasets) + "\n"
            if "var data1 = " in data[i]:
                data[i] = "var data1 = " + str(miles) + "\n"
            if "var data2 = " in data[i]:
                data[i] = "var data2 = " + str(hikes) + "\n"

            outfile.write(data[i])

    outfile.close()


def main():
    data_visited = getData()
    zips, counties = map(data_visited)
    trailing(data_visited)
    sums(data_visited, zips, counties)
    bubble(data_visited)

main()
