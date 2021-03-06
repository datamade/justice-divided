arrests_by_police_district.clean.csv : raw/arrests-14.csv
	perl -p -e 's/\s{2,}//; s/(AGE,{8}|TOTAL)/$$1\n/g' $< | tail -n +2 | head -n 111 | \
	python scripts/make_int.py > $@

output/arrests_by_police_district_2014.csv : arrests_by_police_district.clean.csv
	(echo 'dist_num,race,5-10,11,12,13,14,15,16,17,total'; csvcut -C 1 $< | \
	python scripts/add_dist.py) > $@

arrests_by_district_2014 : output/arrests_by_police_district_2014.csv
	csvsql --db postgresql:///$(PG_DB) --insert --table $@ $<

arrests_by_district_subtables : arrests_by_race_by_district

arrests_by_race_by_district :
	psql -d $(PG_DB) -c " \
		SELECT \
		  dist_num, \
		  SUM( \
		    CASE WHEN race = 'BLACK' \
		    THEN total \
		    ELSE 0 \
		    END) AS num_arrests_black, \
		  SUM( \
		    CASE WHEN race = 'BLACK' \
		    THEN total \
		    ELSE 0 \
		    END)::numeric / SUM(total) AS pct_arrests_black, \
		  SUM( \
		      CASE WHEN race like '%HISPANIC' \
		      THEN total \
		      ELSE 0 \
		      END) AS num_arrests_hispanic, \
		  SUM( \
		    CASE WHEN race like '%HISPANIC' \
		    THEN total \
		    ELSE 0 \
		    END)::numeric / SUM(total) AS pct_arrests_hispanic, \
		  SUM( \
		      CASE WHEN race = 'WHITE' \
		      THEN total \
		      ELSE 0 \
		      END) AS num_arrests_white, \
		  SUM( \
		    CASE WHEN race = 'WHITE' \
		    THEN total \
		    ELSE 0 \
		    END)::numeric / SUM(total) AS pct_arrests_white \
		INTO $@ \
		FROM arrests_by_district_2014 \
		GROUP BY dist_num \
		ORDER BY dist_num"