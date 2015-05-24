import json
import sys, codecs, locale, datetime

stdout = codecs.getwriter('UTF-8')(sys.stdout);
searches = []

def ts2date(unix_ts):
    return datetime.datetime.fromtimestamp(unix_ts).strftime('%Y-%m-%d %H:%M')

for filename in sys.argv[1:]:
    with open(filename, 'r') as f:
        data = json.loads(f.read())
        for e in data['event']:
            query_text = e['query']['query_text']
            ts = int(e['query']['id'][0]['timestamp_usec']) / 1000000
            searches.append((ts, query_text))


sorted_searches = sorted(searches, key=lambda x: x[0])

# write entries
stdout.write("\n".join(["%s %s" % (ts2date(e[0]), e[1]) for e in sorted_searches]))
stdout.write("\n")
