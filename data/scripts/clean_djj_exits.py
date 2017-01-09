import csv
import sys

reader = csv.reader(sys.stdin)
writer = csv.writer(sys.stdout)

parent_zip = None

for row in reader:
	z, demo, *years, total = row
	if z:
		parent_zip = z
	z = parent_zip 
	demo = demo.replace('Asain', 'Asian')
	if ('Total' in demo or not demo):
		continue
	writer.writerow([z, demo, *years[1:], total])