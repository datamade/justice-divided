output/djj_exits.csv : raw/djj_exits_by_zip.xlsx
	in2csv $< | tail -n +2 |\
	(echo 'zip,demo,2015,2014,2013,2012,2011,2010,2009,total'; python scripts/clean_djj_exits.py) > $@

.PHONY : djj-race-totals
djj-race-totals : output/djj_exits.csv
	csvsql --query "select demo, sum(\`2015\`) as total_15 from $(notdir $(basename $<)) group by demo" $< |\
	csvsort -c total_15 -r