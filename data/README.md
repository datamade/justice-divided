# Justice Divided - Analysis
Justice Divided is an in-depth look at the Cook County juvenile justice system that shows punishment doesn't end when a juvenile offender goes free.

This directory contains everything you need to build the database for the underlying analysis.

## Getting Started

### Requirements

* python3
* Postgresql
* csvkit <= 0.9.1 (newest version cannot parse `raw/djj_exits_by_zip.xlsx`)
* psycopg2
* virtualenv / virtualenvwrapper ([Setup](http://docs.python-guide.org/en/latest/dev/virtualenvs/))

### Makin' the data

Create your virtual environment and install the dependencies, then run:

`make database`

To access the database, run:

`psql jdiv`

`\d` will give you a directory of the tables in the database. Look at these tables by running some variation of:

`select * from TABLE_NAME;`

then using `-S` to chop long lines, if needed.

## Data Documentation

Making the database will result in tables for the source data as well as a series of derived tables aggregating that data to Chicago police district (as denoted by a `_by_district` suffix) or demographic group (`_by_race`).

### Raw tables
* **arrests_2014** – Juvenile arrests made by Chicago police in 2014
* **charges_2014** – Charges for which juvenile arrests were made in 2014
* **dispositions_2014** – Post-arrest outcomes for juveniles in 2014
* **jtdc_charges_2015** – Cook County Juvenile Temporary Detention Center starting population, admissions, exits, and ending population broken down by charge for 2015
* **djj_exits_2009_thru_2015** – Illinois Dept. of Juvenile Justice exits (juveniles released from custody) from 2009 to 2015

### Composite table
* **district_profiles** – A convenience table listing the following for each police district:
  * district number
  * district name
  * district population
  * proportion of population that is black
  * top offense for which juveniles were arrested
  * overall misdemeanor-felony ratio
  * total arrests
  * proportion of arrestees that were black
  * number of station adjustments granted
  * proportion of arrests that resulted in adjustments
  * number of arrestees detained in JTDC
  * proportion of arrests that results in detention

### Metadata tables
* **police_district_metadata** – District name, plus demographic information compiled from a combination of American Community Survey 5-year population estimates and police district boundaries from the City of Chicago

### Arrest subtables
* **arrests_by_district** – Juvenile arrests aggregated to police district level
* **arrests_by_race** – Juvenile arrests aggregated to race level
* **ratio_arrests_black_by_district** – Percentage of arrestees who were black, per police district

### Charge subtables
* **charge_totals** – Total arrests per charge
* **top_charge_by_district** – Charge for which the most juveniles were arrested, per district
* **class_totals_by_district** – Count of misdemeanor, felony and unclassified charges, per district
* **mf_ratio_by_district** – Number of misdemeanors divided by number of felonies, per district, where mf_ratio = 0 denotes all arrests were felonies, 0 < mf_ratio < 1 denotes more arrests were felonies than misdemeanors, and mf_ratio > 1 denotes more arrests were misdemeanors than felonies, and a null value denotes no felonies were recorded.

### Disposition subtables
* **detention_by_district** – Count and proportion of arrestees sent to JTDC, per district
* **adjustment_by_district** – Count and proportion of arrestees granted a [station adjustment](http://www.ilga.gov/legislation/ilcs/fulltext.asp?DocName=070504050K5-301), per district

### Detention subtables
* **djj_exits_by_race** – 2015 DJJ exits by race