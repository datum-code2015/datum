(function($) {
	var Index = Index || {};

	Index.getEntities = function() {
		var db = $.couch.db('datum');
		db.view('feeds/demo_entities', {
			group_level: 1,
			success: function(data) {
				data.rows.sort(function(a, b) {
					return b.value - a.value;
				});

				var container = $('#top-entities ul').empty();
				var max = data.rows.length < 10 ? data.rows.length : 10;
				for (var i = 0; i < max; i++) {
					var entity = '<li data-count="' + data.rows[i].value + '"><a href="#' + data.rows[i].key + '" style="width:' + (data.rows[i].value * 150) + 'px;">' + data.rows[i].key + '</a></li>';
					container.append(entity);
				}
			}
		});
	};

	Index.getArticles = function() {
		var entity = window.location.hash.substring(1);
		if (entity == "") {
			entity = null;
			$('#articles h1').text('Trending Topics');
		} else {
			$('#articles h1').text('Trending Topics: ' + entity);
		}
		

		var db = $.couch.db('datum');
		db.view('feeds/selected_articles', {
			startkey: [entity, null],
			endkey: [entity, {}],
			success: function(data) {
				var container = $('#articles-list').empty();

				for (i in data.rows) {
					var article = '<h2><a href="article.html#' + data.rows[i].id + '">' + data.rows[i].key[1] + '</a></h2>' +
												'<div>The Globe and Mail, Date, 2015</div>';
					container.append(article);
				}
			}
		});
	}

	var init = function(context, settings) {
		// $.couch.urlPrefix = 'http://127.0.0.1:5984';

		Index.getEntities();
		Index.getArticles();

		window.addEventListener('hashchange', Index.getArticles, false);
	}

	$(document).ready(init);

}).call(this, jQuery);