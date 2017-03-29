SHELL := bash

GENERATED_FILES = output/arrest_rate_by_race.csv output/youth_population.csv
PG_DB = jdiv

.PHONY : all clean

.INTERMEDIATE : misdemeanor_marijuana_arrests.filtered.csv male_youth_population.csv

$(PG_DB) : 
	createdb $@

output/youth_population.csv : 
	python scripts/make_population_grid.py > $@

include marijuana_arrests.mk

all : $(PG_DB) $(GENERATED_FILES)
	dropdb $(PG_DB)

clean :
	rm output/*