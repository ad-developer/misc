/*!
 * pager.js
 * Simple pager markup is based on Twitter Bootstrap
 */

/*!
 * parameters - object {}
 * con - container id
 *
 * pageSize - page zise - number of elements per page
 *
 * pagerSize - pager size - namber of element in the pager,
 * it is an offset parameter for instanse if passes 2 then total elements per
 * pager will be five, if 1 then 3, if 3 then 7, the formula is (pagerSize x 2 + 1)
 *
 * callBack - call back function will be called
 * 	upon selection of a new page, passeses
 * 	page number (numeric) as a parameter
 *
 * prev - custom previous label (can be ommited or null) ()
 *
 * next - custom next label (can be ommited or null)
 *
 * fl - first and last option ( if ommited then do not spesify first and last)
 *
 * first - custom first label
 *
 * last - custom last label
 *
 * cl - is the container class
 * by default it is set to "pagination pagination-sm pull-right"
 *
 * Markup:

	<ul class="pagination">
		<li><a href="#">Prev</a></li>
		<li class="active"><a href="#">1</a></li>
		<li><a href="#">2</a></li>
		<li><a href="#">3</a></li>
		<li><a href="#">4</a></li>
		<li><a href="#">Next</a></li>
	</ul>

 */

 (function(){

	var

		Pager = window.Pager = function(par){
			var that = this,
				  prev = '<',
				  next = '>';

			that._prev = par.prev ? par.prev : prev;
			that._next = par.next ? par.next : next;
			that._con = '#' + par.con;
			that._pageSize = par.pageSize;
			that._pagerSize = par.pagerSize;
			that._callBack = par.callBack;
			that._first =  par.first? par.first : prev + prev;
			that._last = par.last? par.last : next + next;
			that._fl = par.fl;
			that._cl = par.cl ? par.cl : 'pagination pagination-sm pull-right';
		},
		Sd = function(){
			this.start = 0;
			this.end = 0;
		};

	Pager.prototype = {
		_par: {},
		_id: '#a' + $.guid++,
		_current: -1,
		_built: false,
		_build: function() {
			var
				that = this;
			$(that._con).append('<ul class="' + that._cl + '" id="' + that._id.substring(1, that._id.length) + '"></ul>');
			// We capture all events at one location and
			// pass it to callback method
			$(that._id).click(function(ev){
				var
					sel = parseInt($(ev.target).attr('data'));
				if(sel !== that._current){
					that._callBack.call(that, sel);
				}
			});
			this._built = true;
		},
		_remove: function() {
      $(this._con).empty();
			this._built = false
		},
		_range: function (pageCount) {
			var
				sdo = new Sd();

			if (pageCount <= this._pagerSize) {
				sdo.start = 1;
				sdo.end = pageCount;
			} else {
				sdo.start = Math.max(parseInt(this._current) - this._pagerSize, 1);
				sdo.end = Math.min(parseInt(this._current) + this._pagerSize, pageCount);
			}
			return sdo;
		},
		state: function(totalNumber, selPage){
			var
				that = this,
				wr,
				pages = Math.ceil(totalNumber / that._pageSize),
				i = 0,
				r,
				content;


			if ( selPage && selPage <= pages ) {
				that._current = selPage;
			}

			// rounds upward to the nearest integer
			totalNumber > that._pageSize ? !that._built && that._build(totalNumber) : that._built && that._remove();

			wr = $(that._id);
			if (!wr.length) { return; }
			// make sure there is no any
			// child in the conrainer
			wr.empty();

			if(that._fl){
				if (totalNumber > that._pageSize) {
					if (that._current > 1) {
						$(that._id).append('<li><a data=1>' + that._first + '</a></li>');
					}
				}
			}

			if (totalNumber > that._pageSize) {
				if (that._current > 1) {
					$(that._id).append('<li><a data=' + (that._current - 1) + '>' + that._prev + '</a></li>');
				}
			}

			r = that._range(pages);

			for (i = r.start; i <= r.end; i++) {

				if (that._current === i) {
					content = '<li class="active"><a data=' + i + '>' + i + '</a></li>'
				} else {
					content = '<li><a data=' + i + '>' + i + '</a></li>'
				}

				$(that._id).append(content);
			}

			if (that._current  < pages) {
				$(that._id).append('<li><a data=' + (that._current + 1) + '>' + that._next + '</a></li>');
			}
			if(that._fl){
				if (that._current  < pages) {
					$(that._id).append('<li><a data=' + pages +'>' + that._last + '</a></li>');
				}
			}
		}
	};
})();


// jQuery pager plugin
$.fn.pager = function (option) {
	return this.each(function(){
		var
			$this = $(this),
			data = $this.data('pager');

		if (!data){
			option.con = $this[0].id;
			$this.data('pager', (data = new Pager(option)));
		}
	})
}

$.fn.pager.Constructor = Pager;
