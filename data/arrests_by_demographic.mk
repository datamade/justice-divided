arrests_by_demographic.clean.csv : raw/juvenile-arrests-2013-2017.xlsm
	in2csv --format xlsx $< | \
	tail -n 62310 | head -n 62283 | \
	csvcut -c 1,2,3,4,5,6,7,8 > $@

output/arrests_by_demographic_2013-2017.csv: arrests_by_demographic.clean.csv
	python scripts/unnest_totals.py $< | \
	csvcut -C 8 > $@

arrests_by_demographic_2013_thru_2017 : output/arrests_by_demographic_2013-2017.csv
	csvsql --db postgresql:///$(PG_DB) --insert --table $@ $<

arrests_by_demographic_subtables : arrests_by_race_over_time \
	arrests_by_race_over_time_collapse_hispanic \
	marijuana_possession_over_time_by_race \
	marijuana_possession_over_time_collapse_hispanic

arrests_by_race_over_time :
	psql -d $(PG_DB) -c " \
		SELECT \
		  date_trunc('year', \"ARREST_DATE\") as year, \
		  date_trunc('month', \"ARREST_DATE\") as month, \
		  \"RACE\", \
		  COUNT(\"RACE\") \
		INTO $@ \
		FROM arrests_by_demographic_2013_thru_2017 \
		GROUP BY \
		  year, \
		  month, \
		  \"RACE\" \
		ORDER BY \
		  date_trunc('year', \"ARREST_DATE\"), \
		  date_trunc('month', \"ARREST_DATE\")"

arrests_by_race_over_time_collapse_hispanic : 
	psql -d $(PG_DB) -c " \
		SELECT \
		  year, \
		  month, \
		  split_part(\"RACE\", ' ', 2) AS \"RACE\", \
		  sum(count) AS count \
		INTO $@ \
		FROM arrests_by_race_over_time \
		WHERE \"RACE\" ILIKE '%hispanic%' \
		GROUP BY \
		  year, \
		  month, \
		  split_part(\"RACE\", ' ', 2) \
		UNION \
		  SELECT \
			year, \
			month, \
			\"RACE\", \
			count \
		  FROM arrests_by_race_over_time \
		  WHERE \"RACE\" NOT ILIKE '%hispanic%' \
		  ORDER BY \
			year, \
			month"

marijuana_possession_over_time_by_race :
	psql -d $(PG_DB) -c " \
		SELECT \
		  date_trunc('year', \"ARREST_DATE\") as year, \
		  date_trunc('month', \"ARREST_DATE\") as month, \
		  \"RACE\", \
		  COUNT(\"RACE\") \
		INTO $@ \
		FROM arrests_by_demographic_2013_thru_2017 \
		WHERE \"STATUTE DESCRIPTION\" LIKE 'CANNABIS - POSSESS%' \
		AND \"CHARGE TYPE\" = 'MISDEMEANOR' \
		GROUP BY \
		  year, \
		  month, \
		  \"RACE\" \
		ORDER BY \
		  date_trunc('year', \"ARREST_DATE\"), \
		  date_trunc('month', \"ARREST_DATE\")"

marijuana_possession_over_time_collapse_hispanic : 
	psql -d $(PG_DB) -c " \
		SELECT \
		  year, \
		  month, \
		  split_part(\"RACE\", ' ', 2) AS \"RACE\", \
		  sum(count) AS count \
		INTO $@ \
		FROM marijuana_possession_over_time_by_race \
		WHERE \"RACE\" ILIKE '%hispanic%' \
		GROUP BY \
		  year, \
		  month, \
		  split_part(\"RACE\", ' ', 2) \
		UNION \
		  SELECT \
			year, \
			month, \
			\"RACE\", \
			count \
		  FROM marijuana_possession_over_time_by_race \
		  WHERE \"RACE\" NOT ILIKE '%hispanic%' \
		  ORDER BY \
			year, \
			month"
