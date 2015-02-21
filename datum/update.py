#!/usr/bin/env python
# coding=utf-8

import feedparser
import time

from base import BaseObject


class DatumUpdater(BaseObject):

	def argument_parser(self):
		parser = super(DatumUpdater, self).argument_parser()

		parser.add_argument('datum_db_name', default='DATUM_DB', nargs='?', help='Environment variable name for datum database')

		return parser
		
	def prepare_for_main(self):
		self.datum_db = self.couchdb_client(self.args.datum_db_name)

	def main(self):
		active_feeds = self.datum_db.view('feeds/all_feeds', key=True, include_docs=True)

		for row in active_feeds:
			url = row.doc['url']
			feed = feedparser.parse(url)

			# Determine the existence of the feed's entries
			ids = [row.doc['_id'] + '-' + e.id for e in feed.entries]
			ids_exist = [('error' not in r) for r in self.datum_db.view('_all_docs', keys=ids)]

			# Parse and store entries that don't exist
			additions = []
			for entry, exists in zip(feed.entries, ids_exist):
				if not exists:
					doc = {
						'_id': row.doc['_id'] + '-' + entry.id,
						'feed_id': row.doc['_id'],
						'type': 'article',
						'title': entry.title,
						'link': entry.link,
						'published': time.mktime(entry.published_parsed),
						'summary': entry.summary,
						'analyzed': False
					}
					additions.append(doc)

			if additions:
				self.datum_db.update(additions)


def main(args=None):
	return DatumUpdater(args=args).run()


if __name__ == '__main__':
	main()