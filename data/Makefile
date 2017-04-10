SHELL := bash

GENERATED_FILES = output/arrest_rate_by_race.csv output/police_district_demographics.csv
PG_DB = jdiv

.PHONY : all clean

.INTERMEDIATE : misdemeanor_marijuana_arrests.filtered.csv male_youth_population.csv

$(PG_DB) : 
	createdb $@

output/police_district_demographics.csv : 
	python scripts/get_police_district_demos.py > $@

include marijuana_arrests.mk

all : $(PG_DB) $(GENERATED_FILES)
	dropdb $(PG_DB)

clean :
	rm output/*