# -*- coding: utf-8 -*-
# acs5 docs: http://api.census.gov/data/2015/acs5/variables.html

import csv
import json
from itertools import chain
import sys

from census_area import Census

from config import CENSUS_API_KEY

c = Census(CENSUS_API_KEY)

# sex by age – black male juveniles
sba_male_10_14_black = "B01001B_005E"
sba_male_15_17_black = "B01001B_006E"

# sex by age - all male juveniles
sba_male_10_14_total = "B01001_005E"
sba_male_15_17_total = "B01001_006E"

# sex by age - total population
sba_all_black = "B01001B_001E"
sba_all_total = "B01001_001E"

with open("raw/police_district_boundaries.geojson", "r") as f:
    police_districts = json.load(f)

writer = csv.writer(sys.stdout)

for district in police_districts["features"]:
    
    dist_num = district["properties"]["dist_num"]
    
    if dist_num == "31":
        continue

    geo = district["geometry"]

    black_males_10_14 = c.acs5.geo_tract(("NAME", sba_male_10_14_black), geo)
    black_males_15_17 = c.acs5.geo_tract(("NAME", sba_male_15_17_black), geo)

    all_males_10_14 = c.acs5.geo_tract(("NAME", sba_male_10_14_total), geo)
    all_males_15_17 = c.acs5.geo_tract(("NAME", sba_male_15_17_total), geo)
    
    total_black_pop = c.acs5.geo_tract(("NAME", sba_all_black), geo)
    total_pop = c.acs5.geo_tract(("NAME", sba_all_total), geo)

    dist_data = {"dist_num": dist_num}

    for _, tract_data in chain(black_males_10_14, black_males_15_17,
                               all_males_10_14, all_males_15_17,
                               total_black_pop, total_pop):

        for k, v in tract_data.items():
            if k.startswith("B01"):
                try: 
                    dist_data[k] += int(v)
                except KeyError:
                    dist_data[k] = int(v)
    
    black_male_juvenile_pop = dist_data[sba_male_10_14_black] + dist_data[sba_male_15_17_black]
    total_male_juvenile_pop = dist_data[sba_male_10_14_total] + dist_data[sba_male_15_17_total]

    pct_juv_black = round(black_male_juvenile_pop / total_male_juvenile_pop * 100, 2)
    pct_pop_black = round(dist_data[sba_all_black] / dist_data[sba_all_total] * 100, 2)

    writer.writerow([
        dist_data["dist_num"],
        black_male_juvenile_pop, total_male_juvenile_pop, pct_juv_black,
        dist_data[sba_all_black], dist_data[sba_all_total], pct_pop_black
    ])
