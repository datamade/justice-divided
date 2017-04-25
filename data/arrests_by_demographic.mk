arrests_by_demographic.clean.csv : raw/juvenile-arrests-2013-2017.xlsm
	in2csv --format xlsx $< | \
	tail -n 62310 | head -n 62283 | \
	csvcut -c 1,2,3,4,5,6,7,8 > $@

output/arrests_by_demographic_2013-2017.csv: arrests_by_demographic.clean.csv
	python scripts/unnest_totals.py $< | \
	csvcut -C 8 > $@

arrests_by_demographic_2013_thru_2017 : output/arrests_by_demographic_2013-2017.csv
	csvsql --db postgresql:///$(PG_DB) --insert --table $@ $<

arrests_by_demographic_subtables : arrests_by_race

arrests_by_race :
	psql -d $(PG_DB) -c " \
		SELECT \
			\"RACE\", \
			COUNT(\"RACE\") \
	 	INTO $@ \
		FROM arrests_by_demographic_2013_thru_2017 \
		GROUP BY \"RACE\" \
		ORDER BY count DESC"