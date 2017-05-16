djj_exits_to_cook_county.csv : raw/djj_exits_by_zip.xlsx
	in2csv $< | tail -n +2 | \
	(echo zip,demo,exits_15,exits_14,exits_13,exits_12,exits_11,exits_10,exits_09,total; \
	 python scripts/clean_djj_exits.py) > $@

chicago_zips.csv : raw/chicago_zip_codes.csv
	in2csv $^ | csvcut -c ZIP > $@

output/djj_exits_to_chicago.csv : djj_exits_to_cook_county.csv chicago_zips.csv
	csvjoin -c zip,ZIP $^ | csvcut -C ZIP > $@

djj_exits_to_chicago : output/djj_exits_to_chicago.csv
	csvsql --db postgresql:///$(PG_DB) --insert --table $@ $<

djj_exits_to_chicago_by_race :
	psql -d $(PG_DB) -c " \
		SELECT \
		  regexp_replace(demo, '\s(Male|Female)', '') AS demo, \
		  SUM(exits_15) AS total_exits_2015 \
		INTO $@ \
		FROM djj_exits_to_chicago \
		GROUP BY regexp_replace(demo, '\s(Male|Female)', '') \
		ORDER BY total_exits_2015 DESC"
