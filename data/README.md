### what's this?

we built a map showing racial disparity in juvenile arrests by police district. here's how.

### requirements

- [census_area](https://github.com/datamade/census_area) (`pip install census_area`)
- [csvkit](https://github.com/wireservice/csvkit) (`pip install csvkit`)
- postgresql (`brew install postgresql`)

### replication

[get an api key](http://api.census.gov/data/key_signup.html) for the us census.

from the `data/` dir:

```
cp scripts/config.py.example scripts/config.py
```

then add your census api key to `config.py`.

to refresh the data, `make clean` then `make all`. 

### contents

- a psql database, `jdiv`, with the following tables:

```
 public | arrests_2014                              | table | Hannah
 public | arrests_by_district                       | table | Hannah
 public | arrests_by_race                           | table | Hannah
 public | district_profiles                         | table | Hannah
 public | juvenile_demographic_percents             | table | Hannah
 public | juvenile_demographic_percents_by_district | table | Hannah
 public | juvenile_demographic_totals               | table | Hannah
 public | juvenile_demographic_totals_by_district   | table | Hannah
 public | police_district_demographics              | table | Hannah
 public | police_district_names                     | table | Hannah
 public | ratio_arrests_black_by_district           | table | Hannah
```

- an `output/` dir, containing the following in csv format:

  - `arrests_by_police_district.csv` - xxx
  - `police_district_demographics.csv` - xxx
  - `police_district_profiles.csv` - xxx
