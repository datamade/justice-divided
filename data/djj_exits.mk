.INTERMEDIATE : djj.clean.csv
djj.clean.csv : raw/djj_exits_by_zip.xlsx
	in2csv $< | tail -n +2 | \
	(echo zip,demo,exits_15,exits_14,exits_13,exits_12,exits_11,exits_10,exits_09,total; python scripts/clean_djj_exits.py) > $@

djj_exits_2009_thru_2015 : djj.clean.csv
	csvsql --db postgresql:///$(PG_DB) --insert --table $@ $<

djj_exits_by_race :
	psql -d $(PG_DB) -c " \
		SELECT \
		  demo, \
		  SUM(exits_15) AS total_exits_2015 \
		INTO $@ \
		FROM djj_exits_2009_thru_2015 \
		GROUP BY demo \
		ORDER BY total_exits_2015 DESC"