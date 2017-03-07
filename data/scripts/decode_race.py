import csv
import sys

_, infile = sys.argv

reader = csv.reader(open(infile).readlines())
writer = csv.writer(sys.stdout)
writer.writerow([c.lower() for c in next(reader)])

race_definitions = {'BLK': 'black',
                    'WWH': 'white hispanic',
                    'WHI': 'white',
                    'WBH': 'black hispanic',
                    'API': 'asian/pac islander',
                    'U': 'unknown'}

for row in reader:
    cb_no, race, *fields = row
    writer.writerow([cb_no, race_definitions[race], *fields])