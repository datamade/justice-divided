### What's this?

We crunched numbers on juvenile arrests in Chicago by police district (2014) and demographic (2013-early 2017). Now they're yours.

### Requirements

- If you want to refresh the provided data, [census_area](https://github.com/datamade/census_area) (`pip install census_area`)
- [csvkit](https://github.com/wireservice/csvkit) (`pip install csvkit`)
- postgresql (`brew install postgresql`)

### Makin' data

Clone this repo and navigate to the `data/` dir in your terminal. From there you can [make the database](#make-the-database) or [remake the provided data, then make the database](#remake-provided-data-then-make-the-database).

#### Make the database

```bash
make all
```

#### Remake provided data, then make the database

⚠️ Re-running the Census script will take about 20 minutes. ⚠️ 

If you must, [get an API key](http://api.census.gov/data/key_signup.html) for the U.S. Census. Then, from the `data/` dir, run this command:

```bash
cp scripts/config.py.example scripts/config.py
```

Add your Census API key to your freshly created `config.py`. 

Finally, run:

```bash
make clean # empties output/  
make all
```

### Data documentation

- A Postgres database, `jdiv`, containing:
    - **arrests_by_district_2014** - All juvenile arrests in 2014 by race, age, and police district obtained via FOIA by [Mariame Kaba](http://mariamekaba.com/)/[Project NIA](http://www.project-nia.org/), first published in the [third edition of Arresting Justice](https://chiyouthjustice.files.wordpress.com/2015/11/cpd-juvenile-arrest-stats-2013-2014rev.pdf)
        - **arrests_by_race_and_district** - Number and percent total of arrests of black, Hispanic and white juveniles by police district

    - **arrests_by_demographic_2013_thru_2017** - Age, sex, race, statute violated, statute description, charge type (misdemeanor or felony) for all juvenile arrests Jan. 1, 2013 to March 2017, obtained via FOIA by DataMade
        - **arrests_by_race** - Number of arrests by race for the above time period
        - **marijuana_possession_by_race_over_time** - Number of misdemeanor marijuana arrests by race by year and by month for the above time period

    - **police_district_names** - Hand compiled from [CPD website](http://home.chicagopolice.org/community/districts/)
    
    - **police_district_demographics** - Number of boys and girls between the ages of 10 and 17 in each Chicago police district for the following racial/ethnic categories: White, not Hispanic; Black only; and Hispanic. Compiled using [census_area](https://github.com/datamade/census_area) and police district boundaries from [the City of Chicago data portal](https://data.cityofchicago.org/Public-Safety/Boundaries-Police-Districts-current-/fthy-xz3r)
        - **juvenile_demographic_percents** - Citywide juvenile population by race (percent)
        - **juvenile_demographic_totals** - Citywide juvenile population by race (total)
        - **juvenile_demographic_percents_by_district** - Juvenile population by police district by race (percent)
        - **juvenile_demographic_totals_by_district** - Juvenile population by police district by race (total)

    - **district_profiles** - Composite table with the following columns:
        - dist_num
        - dist_name
        - num_youth
        - num_youth_black
        - pct_youth_black
        - num_youth_hispanic
        - pct_youth_hispanic
        - num_youth_white
        - pct_youth_white
        - num_arrests
        - num_arrests_black
        - pct_arrests_black
        - num_arrests_hispanic
        - pct_arrests_hispanic
        - num_arrests_white
        - pct_arrests_white

- An `output/` directory containing CSV files corresponding to the raw tables in the database, as well as `district_profiles` in GeoJSON format
