.INTERMEDIATE : disp.clean.csv
disp.clean.csv : raw/disp-by-dist-14.csv
	csvcut -C 1 $^ | tail -n +4 | head -n 311 | perl -p -e 's/ ,/,/g; s/, /,/g; s/ $$//' > $@

.INTERMEDIATE : disp.pivot.csv
disp.pivot.csv : disp.clean.csv
	(echo 'dist_num,disposition,female,male,unknown,total'; cat $< | python scripts/add_dist.py) > $@

dispositions_2014 : disp.pivot.csv
	csvsql --db postgresql:///$(PG_DB) --insert --table $@ $<
	psql -d $(PG_DB) -c "ALTER TABLE $@ ALTER COLUMN unknown TYPE integer"

.PHONY : disposition_subtables
disposition_subtables : detention_by_district adjustment_by_district

detention_by_district : 
	psql -d $(PG_DB) -c " \
		SELECT \
		  dist_num, \
		  num_detentions, \
		  num_arrests, \
		  ROUND( \
		    num_detentions / num_arrests * 100, 2) AS detention_ratio \
		INTO $@ \
		FROM ( \
		  SELECT \
		    dist_num, \
		    SUM(CASE WHEN disposition = 'DETAINED (DETENTION CENTER)' THEN total ELSE 0 END) AS num_detentions, \
		    SUM(total) AS num_arrests \
		  FROM dispositions_2014 \
		  GROUP BY dist_num) AS t \
		ORDER BY dist_num"

adjustment_by_district :
	psql -d $(PG_DB) -c " \
		SELECT \
		  dist_num, \
		  num_adjustments, \
		  num_arrests, \
		  ROUND( \
		    num_adjustments / num_arrests * 100, 2) AS adjustment_ratio \
		INTO $@ \
		FROM ( \
		  SELECT \
		    dist_num, \
		    SUM(CASE WHEN disposition LIKE '%ADJUSTMENT%' THEN total ELSE 0 END) AS num_adjustments, \
		    SUM(total) AS num_arrests \
		  FROM dispositions_2014 \
		  GROUP BY dist_num) AS t \
		ORDER BY dist_num"