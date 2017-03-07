## under the hood

here are the calculations underlying the visualization.

### requirements

- [census](https://github.com/CommerceDataService/census-wrapper) (`pip install census`)
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

- `raw/misdemeanor_cannabis_arrests.csv` was a foia response fulfilled by the chicago police department in march 2017.

- `output/` contains:

  - `misdemeanor_marijuana_arrests.csv` - from source foia, marijuana arrests of males aged 18 and 19 from 2015, the most recent complete year represented in the data
  - `arrests_by_race.csv` - the above, rolled up by race
  - `arrest_rate_by_race.csv` - the above, rolled up by race and divided respectively by the population of white and black 18- and 19-year-olds in chicago as gleaned from 5-year acs estimates, resulting in arrest rates per population