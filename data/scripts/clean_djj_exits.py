import sys
import re

z = None
lines = []

lines.append(
	'zip,demo,2015,2014,2013,2012,2011,2010,2009,total\n'
)

for line in sys.stdin:
	if re.match(r'\d{5}', line.split(',')[0]):
		line = line.split(',')
		z = line.pop(0)
		line = ',%s' % ','.join(line)
	if any(x in line for x in ['Total', ',,,']):
		continue
	line = re.sub('Asain', 'Asian', line)
	line = re.sub(r'[a-z],,', 'e,', line)
	line = '%s%s' % (z, line)
	lines.append(line)

lines.append(lines.pop(-1).rstrip('\n'))

with sys.stdout as f:
	f.write(''.join([line for line in lines]))