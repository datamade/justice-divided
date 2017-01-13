.PHONY : graffiti
graffiti : graffiti_removal_calls graffiti_removal_by_district

raw/graffiti_311.csv : 
	curl -o $@ http://data.cityofchicago.org/api/views/ydr8-5enu/rows.csv?accessType=DOWNLOAD

graffiti_removal_calls : raw/graffiti_311.csv
	csvsql --db postgresql:///$(PG_DB) --insert --table $@ $<

graffiti_removal_by_district : 
	psql -d $(PG_DB) -c ' \
		SELECT \
		  "Police District" AS dist_num, \
		  count(*) \
		INTO $@ \
		FROM graffiti_removal_calls \
		GROUP BY "Police District" \
		ORDER BY "Police District"'