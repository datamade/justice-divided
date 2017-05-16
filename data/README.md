## What's this?

In support of [Justice Divided](https://justicedivided.com), we crunched numbers on:

* Chicago's youth population;
* juvenile arrests in Chicago by police district (2014) and demographic (2013 - early 2017); and
* exits from the Illinois Department of Juvenile Justice to Chicago ZIP codes (2009 - 2015).

 Now they're yours!

[Jump to documentation](#data-documentation). 📓

## Requirements

- Python 3.x
- [GNU Make](https://www.gnu.org/software/make/) (If you're running OS X or Linux, you already have this)
- If you want to refresh the provided output data, [census_area](https://github.com/datamade/census_area) (`pip install census_area`)
- [csvkit](https://github.com/wireservice/csvkit) (`pip install csvkit`)
- [Postgres](https://www.postgresql.org/) (`brew install postgresql`)

## Makin' data

Clone this repo and navigate to the `data/` dir in your terminal. From there you can [make the database](#make-the-database) or [remake the provided data, then make the database](#remake-provided-data-then-make-the-database).

### Make the database

```bash
make all
```

### Remake provided data, then make the database

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

## Data documentation

Running the provided scripts will generate two sorts of output: several CSVs, located in the `/output` directory, and a Postgres database called `jdiv`, containing those CSVs, plus some aggegregated, composite, and/or metadata tables for your convenience.

**Jump to:** [Arrests](#-arrests) | [Demographics](#-demographics) | [Detention](#-detention) | [Composite/meta data](#-composite-meta-data)

### 🚓 Arrests 

* #### Arrests by demographic (2013 - 2017)

  * **Source:** Chicago Police Department ([View raw](https://github.com/datamade/justice-divided/blob/master/data/raw/juvenile-arrests-2013-2017.xlsm))
  * **Obtained by:** DataMade
  * **Cleaned CSV:** [arrests_by_demographic_2013-2017.csv](https://github.com/datamade/justice-divided/blob/master/data/output/arrests_by_demographic_2013-2017.csv)
  * **Corresponding table:** arrests_by_demographic_2013_thru_2017
  * **Description:** This dataset contains age, sex, race/ethnicity, statute violated, statute description, and charge type (misdemeanor or felony) for all juvenile arrests made by the Chicago Police Department from Jan. 1, 2013 to March 2017.
  * **Derived tables**
  
    * **arrests_by_race_over_time** - All arrests by year, month, and race (differentiates between black and white Hispanic)
    * **arrests_by_race_over_time_collapse_hispanic** - All arrests by year, month, and race (combines black and white Hispanic into single Hispanic category)
    * **marijuana_possession_over_time_by_race** - Misdemeanor marijuana possession arrests by year, month, and race (differentiates between black and white Hispanic)
    * **marijuana_possession_over_time_collapse_hispanic** - Misdemeanor marijuana possession arrests by year, month, and race (combines black and white Hispanic into single Hispanic category)

* #### Arrests by police district (2014)

  * **Source:** Chicago Police Department ([View raw](https://github.com/datamade/justice-divided/blob/master/data/raw/arrests-14.csv))
  * **Obtained by:** Mariame Kaba / Project NIA
  * **Cleaned CSV:** [arrests_by_police_district_2014.csv](https://github.com/datamade/justice-divided/blob/master/data/output/arrests_by_police_district_2014.csv)
  * **Corresponding table:** arrests_by_district_2014
  * **Description:** Originally published in the third edition of [Arresting Justice](https://chiyouthjustice.files.wordpress.com/2015/11/cpd-juvenile-arrest-stats-2013-2014rev.pdf), a semi-annual analysis of juvenile arrests in Chicago, this dataset contains counts of all juvenile arrests made by the Chicago Police Department in 2014 per police district, by race/ethnicity and age.
  * **Derived tables**
  
    * **arrests_by_race_by_district** - Number and percent total of arrests of black, Hispanic, and white juveniles by police district

### 📊 Demographics

* #### Chicago juvenile population by race by police district (2014)

  * **Source:** American Community Survey 
  * **Obtained by:** DataMade
  * **Cleaned CSV:** [police_district_demographics.csv](https://github.com/datamade/justice-divided/blob/master/data/output/police_district_demographics.csv)
  * **Corresponding table:** police_district_demographics
  * **Description:** This dataset contains the number of boys and girls between the ages of 10 and 17 in each Chicago police district for the following racial/ethnic categories: White, not Hispanic; Black only; and Hispanic. 

    These counts were compiled using [census_area](https://github.com/datamade/census_area) and [police district boundaries from the City of Chicago data portal](https://data.cityofchicago.org/Public-Safety/Boundaries-Police-Districts-current-/fthy-xz3r).
  * **Derived tables**
  
    * **juvenile_demographic_percents** - Citywide juvenile population by race (percent)
    * **juvenile_demographic_totals** - Citywide juvenile population by race (total)
    * **juvenile_demographic_percents_by_district** - Juvenile population by police district by race (percent)
    * **juvenile_demographic_totals_by_district** - Juvenile population by police district by race (total)

### 🔐 Detention

* #### Illinois Department of Juvenile Justice exits to Chicago ZIP codes (2009 - 2015)

  * **Source:** Illinois Department of Juvenile Justice ([View raw](https://github.com/datamade/justice-divided/blob/master/data/raw/djj_exits_by_zip.xlsx))
  * **Obtained by:** Dan Cooper / Adler University
  * **Cleaned CSV:** [djj_exits_to_chicago.csv](https://github.com/datamade/justice-divided/blob/master/data/output/djj_exits_to_chicago.csv)
  * **Corresponding table:** djj_exits_to_chicago
  * **Description:** This dataset contains counts of juvenile exits to Chicago from Illinois Department of Juvenile Justice institutions by ZIP, gender, and race/ethnicity from 2009 to 2015.

    The source dataset contains exits to Cook County. It was filtered using ZIP codes from the [City of Chicago data portal](https://data.cityofchicago.org/Facilities-Geographic-Boundaries/Boundaries-ZIP-Codes/gdcf-axmw).
  * **Derived tables**
  
    * **djj_exits_to_chicago_by_race** - Exits to the City of Chicago by race (gender combined) and year

### 🌟 Composite/meta data

* **[police_district_profiles.csv](https://github.com/datamade/justice-divided/blob/master/data/output/police_district_profiles.csv) / [police_district_profiles.geojson](https://github.com/datamade/justice-divided/blob/master/data/output/police_district_profiles.geojson) / district_profiles** - This dataset contains police district name and number, plus count and percent total for youth population and juvenile arrests by the following racial/ethnic categories: White, not Hispanic; Black only; and Hispanic.

  It combines information from juvenile arrests by Chicago police district, Chicago police district juvenile population by race, and police district boundaries from the City of Chicago data portal.

* **police_district_names** - This table contains the name and district number for each police district, ready for joining on `dist_num` with any table with `_by_district` in the name. It was hand compiled from [the CPD website](http://home.chicagopolice.org/community/districts/).

