.INTERMEDIATE : djj.clean.csv
djj.clean.csv : raw/djj_exits_by_zip.xlsx
	in2csv $< | tail -n +2 | \
	(echo zip,demo,exits_15,exits_14,exits_13,exits_12,exits_11,exits_10,exits_09,total; python scripts/clean_djj_exits.py) > $@

.INTERMEDIATE : jtdc.clean.csv
jtdc.clean.csv : raw/jtdc_charges.csv
	(echo charge,start_num,start_pct,admit_num,admit_pct,release_num,release_pct,end_num,end_pct,alos; \
	tail -n +3 raw/jtdc_charges.csv | perl -p -e 's/%//g') > $@

djj_exits_2009_thru_2015 : djj.clean.csv
	csvsql --db postgresql:///$(PG_DB) --insert --table $@ $<

jtdc_charges_2015 : jtdc.clean.csv
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
