import sys

import agate

_, labels, bars = sys.argv

table = agate.Table.from_csv(sys.stdin)
table.print_bars(labels, bars)