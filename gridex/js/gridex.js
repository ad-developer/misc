/**
 * Copyright 2017 A.D.
 *
 * file: gridex.js
 * dependency: pager.js
 * gridex.css
 *
 * markup:
 * <div>
 * 		<table class="table table-striped table-hover">
 *			<thead>
 *				<tr>
 *					<th></th>
 *				</tr>
 *			</thead>
 *			<tbody>
 *				<tr>
 *					<td></td>
 *				<tr>
 *			</tbody>
 *		<>
 * CSS:
 * grid uses twitter Bootstrap classs
 * in addition gridex.css file must be included
 *
 * rpc: ../request_controller?
 * rpc_return: {}
 * options
 *{
 *  source: object.getData(par, callback)
 *      par - can be any object but must include the following fields if
 *      paging is engaged {
 *                          page - int
 *                          pageSize - int
 *                        }
 *      and if sorting is engaged
 *                        {
 *                          sortField -  string
 *                          sortDirection -  string
 *                        }
 *	con: 'con', r container id
 *	fields: [
 *	         { name:'Field_Name',
 			   header:'Header Name',
 			   width: 200,
 			   edit: true,
 			   sort: {
 			   			default: true, - default can be omitted,
 			   			direction: [asc|desc] - direction can be omitted
            },
          filter: {
            server: [true|false]
         },
 			   custom: function(record){
					return 'html';
 			   }
 			 },
			 ...
 			], r update is predefined fields that will add the button to the grid
 *  sort: {
 			field: 'field_name',
			direction: [asc|desc]
 		   },
 *	pager: {pageSise: 10, pagerSize: 2, [position: 'center | left']}, by default
 *  pager position is right and does not need to be set
 *	key: 'id',	identity field r
 *  sort: {field: 'filedName', dirction: [asc|desc]}
 *  befoBind: function(data){ return true} fired before data bind, if return false then binding process is cancelled.
 *	selectCallBack: function(record){}, selected row callback, return selected row record, n
 *	updateCallBack: function(record){}  update row callback, return selected row record n
 *  proc: function(startStop) {} indicated where process of loading data started or stopped.
 *  ===========================================================================================
 *	rpc return {gd:[{Name: 'Alex', Address:'Some Address'},..., {...}], total: 200}
 *  ===========================================================================================
 */

(function () {
    var
		Grid = window.Grid = function (options) {
		    var that = this;
		    that._o = options;
		    that._o.con = '#' + options.con;
		    that._id = 'g' + ($.guid++);

		    // Setting up sort metadata
		    if (options.sort) {
		        that._sort = {};
		        that._sort.field = options.sort.field;
		        that._sort.dir = 'asc';
		        if (options.sort.direction) {
		            that._sort.dir = 'desc';
		        }
		    }
		};

    Grid.prototype = {
        _progress: false,
        _action: function (show) {},
        _roleUpdate: 'edit',
        _roleDelete: 'delete',
        _roleConfirm: 'confirm',
        _data: [],
        _pagerIdex: 1,
        _st: '',
        _built: false,
        _gridContent: null,
        _filterOpt: {},
        _selFiltOpt: {},
        _getRecord: function (key) {

            if ($.type(key) === 'number') {
                key = parseInt(key);
            }

            for (var i = 0, record; record = this._data.gd[i]; i++) {
                if (record[this._o.key] === key) {
                    return record;
                }
            }
        },
        _setState: function () {
            var that = this,
				        pager = that._o.pager;
            that._st = {};

            if (pager) {
                that._st.page = that._pagerIdex;
                if (pager.pageSize) {
                    that._st.pageSize = pager.pageSize;
                }
            }
            if (that._sort) {
                that._st.sortField = that._sort.field;
                that._st.sortDirection = that._sort.dir;
            }
            // Filtering: On the first load we will not have any
            // finltering fields selected and as such we do not need to add
            // any information to the state. The filtering information will be
            // comming from the protexted _selFiltOpt variable
            that._st.filter = that._selFiltOpt;

        },

        // filter options blcok of methods
        _groupBy: function(column){
          var flags = [],
              output = [],
              el,
              i = 0,
              array = this._data.gd;
          if(array){
            for(;el = array[i++];) {
                el = el[column];
                if( flags[el]){
                  continue;
                }
                flags[el] = true;
                output.push(el);
            }
          }
          return output;
        },
        _selectFilterOption: function(el, e, all){
          // TODO: this method needs to be optimized
          var me = $(el),
              val = me.attr('ad-value'),
              fieldName = me.parent().attr('id').split('_')[2],
              field = this._filterOpt[fieldName],
              chbx = me.children('input'),
              target = $(e.target),
              ul = me.closest('ul').find('input');

          if(target.is('li') || target.is('span')){
            if(chbx.is(':checked')){
              field.s--;
              all ? this._addRemSelOpt(fieldName, field.l) : this._addRemSelOpt(fieldName, val);
              all && ul.prop('checked', false) && (field.s = 0);
              chbx.prop('checked', false);
            } else {
              field.s++;
              all ? this._addRemSelOpt(fieldName, field.l, true) : this._addRemSelOpt(fieldName, val, true);
              all && ul.prop('checked', true) && (field.s = field.t);
              chbx.prop('checked', true);
           }
          } else {
            if(chbx.is(':checked')){
              field.s--;
              all ? this._addRemSelOpt(fieldName, field.l) : this._addRemSelOpt(fieldName, val);
              all && ul.prop('checked', false) && (field.s = 0);
            } else {
              field.s++;
              all ? this._addRemSelOpt(fieldName, field.l, true) : this._addRemSelOpt(fieldName, val, true);
              all && ul.prop('checked', true) && (field.s = field.t);
            }
          }
          if(!all){
              all = true;
              if(field.s < field.t){
                all = false;
              }
              me.closest('ul')
                .find('[dt-all]')
                .find('input')
                .prop('checked', all);
          }
          //gex-filter-btn-applied
          // setting ul to the filter btn
          ul = me.closest('th').find('.gex-filter-btn');
          if(field.s > 0){
            ul.addClass('gex-filter-btn-applied');
          } else {
            ul.removeClass('gex-filter-btn-applied');
          }

          this.bind();
        },
        _addRemSelOpt: function(fieldName, par, add){
          var index = 0,
              el;
          if(Array.isArray(par)){
              for (;el = par[index++];) {
                this._addRemSelOpt(fieldName, el, add);
              }
          } else {

            el = this._selFiltOpt[fieldName];
            if(el){
              index = el.indexOf(par);
            } else {
              el = this._selFiltOpt[fieldName] = [];
              index = -1;
            }

            if(add){
              if(index <= -1){
                el.push(par);
              }
            } else {
              if(index > -1){
                el.splice(index, 1);
              }
            }
          }
        },
        _addFilterOptions: function(){
          var $this = this,
              e,
              list,
              con,
              i = 0,
              j;
          for (; e = this._o.fields[i]; i++) {
              if(e.filter){
                if(e.filter.server){
                  list = this._data.ft[e.name];
                } else {
                  list = this._groupBy(e.name);
                }
                if(list && list.length){
                    // set initial state of filter options
                    $this._filterOpt[e.name] = {};
                    $this._filterOpt[e.name].t = list.length
                    $this._filterOpt[e.name].s = 0
                    $this._filterOpt[e.name].l = list;
                    con = $('#col_ch_' + e.name);
                    con
                    .empty()
                    .append(
                      $('<li/>')
                        .attr('dt-all',true)
                        .append($('<input/>').attr('type','checkbox'))
                        .append($('<span/>').text('All'))
                        .on('click', function(e){
                           $this._selectFilterOption(this, event, true);
          						   })
                    );
                    j = 0;
                    for (;e = list[j++];) {
                      con
                      .append(
                        $('<li/>')
                          .attr('ad-value', e)
                          .append($('<input/>').attr('type','checkbox'))
                          .append($('<span/>').text(e))
                          .on('click', function(){
                             $this._selectFilterOption(this, event, false);
                          })
                      );
                    }
                }
              }
          }
        },

        _resetDirection: function (context, field, el) {
            var that = this,
                newEl = $('<span />'),
                srtD = '(Sorted descending)',
                srtA = '(Sorted ascending)',
                br = '&#013;',
                tooltip;

            // Remove all carets
            $(this._o.con)
              .find('.caret')
              .remove();

            // Reset all tooltips
            $(this._o.con)
                .find('gex-header-label').each(function(){
                  tooltip = $(this).attr('title');
                  tooltip = tooltip()
                });

            // Add caret to selected
            // header
            newEl.addClass('caret');
            if (that._sort.field === field) {
                if (that._sort.dir === 'asc') {
                    that._sort.dir = 'desc';
                    newEl.addClass('up');
                } else {
                    that._sort.dir = 'asc';
                }
            } else {
                that._sort.dir = 'asc';
            }

            // Add carret to the link
            $(el).append(newEl);

            // Set new state
            that._sort.field = field;
        },
        _createHeaderCell: function (option, btn, sort, filter) {
            var that = this,
        				th = $('<th/>').addClass('gex-header'),
                hCon = $('<div/>').addClass('gex-header-container'),
                hLabel = $('<div/>').addClass('gex-header-label'),
                hfMask = $('<div/>').addClass('gex-filter-mask'),
                br = '&#013;',
                tooltip,
                link,
        				ar;
            if (option.width) {
                th.width(option.width);
            }
            tooltip = option.header;
            if (sort) {
                +function (me, field, header) {

                    link = $('<a/>').click(function () {
                        that._resetDirection.call(that, me, field, this);
                        that.bind();
                    }).text(header);

                }(this, option.name, option.header);

                if (option.name === that._sort.field) {
                    ar = $('<span />').addClass('caret');
                    if (that._sort.dir && that._sort.dir === 'desc') {
                        ar.addClass('up');
                    }
                    link.append(ar);
                    tooltip += br + '(Sorted descending)'
                }
                hLabel.append(link);

            } else if (!btn) {
                hLabel.text(option.header);
            }

            hLabel.attr('title', tooltip);

            if(filter){
              th.append(
                $('<span/>')
                  .addClass('glyphicon glyphicon-filter  gex-filter-btn pull-right')
                  .attr('ad-ref-list', 'col_ch_' + option.name)
                  .on('click', function(){
                    var me = $(this),
                        parent = me.parent().addClass('gex-header-selected');
                    $('#' + me.attr('ad-ref-list'))
                    .parent()
                    .width(parent.outerWidth() - 2)
                    .show();
                  })
              )
              .append(
                $('<div/>')
                .hide()
                .addClass('gex-list')
                .append(
                  $('<ul>')
                    .attr('id', 'col_ch_' + option.name)
                    .addClass('gex-choice-block gex-list-block')
                )
                .on('mouseleave',function(){
                    th.removeClass('gex-header-selected');
                    $(this).hide();
                })
              )
              .on('mouseleave', function(){
                $(this)
                .removeClass('gex-header-selected')
                .children('.gex-list').hide();
              });
            }

            return th;
        },
        _createHeader: function () {
            var thead = $('<thead/>'),
        				tr = $('<tr/>'),
        				e,
        				colnum,
        				i = 0,
        				btn;

            for (; e = this._o.fields[i]; i++) {

                edit = false;
                if (e.name === 'edit' || e.name == 'delete') {
                    btn = true;
                }
                tr.append(this._createHeaderCell(e, btn, e.sort, e.filter));
                colnum++;
            }
            thead.append(tr);
            $('#' + this._id).append(thead);
        },
        _createCell: function (value) {
            return '<td title="' + value + '">' + value + '</td>';
        },
        _createButtonCell: function (name, role) {
            return '<td><span role="' + role + '" class="edit label label-info">' + name + '</span></td>';
        },
        _createLinkCell: function (value, name) {
            if (!name) {
                name = value;
            }
            return '<td><a href="' + value + '" target="_blank">' + name + '</a></td>';
        },
        _createCustomCell: function (handler, row) {
            var cont = handler(row, this._data);
            return '<td>' + cont + '</td>';
        },
        _createRow: function (row) {
            var that = this,
        				// TODO: This is a limited implementation of the identity field and will need to be revised
        				content = '<tr data-key="' + row[that._o.key] + '">',
        				field,
        				i = 0,
        				rowData = {};

            $.extend(rowData, row);

            if (that._o.beforeRednderRow) {
                that._o.beforeRednderRow(rowData);
            }

            for (; field = that._o.fields[i]; i++) {

                if (field.link) {
                    content += that._createLinkCell(rowData[field.name], field.linkTitle);
                } else if (field.custom) {
                    content += that._createCustomCell(field.custom, row);
                } else if (field.name === that._roleUpdate) {
                    content += that._createButtonCell('Edit', that._roleUpdate);
                } else if (field.name === that._roleDelete) {
                    content += that._createButtonCell('Delete', that._roleDelete);
                } else {
                    content += that._createCell(rowData[field.name]);
                }
            };

            content += '</tr>';
            return content;
        },
        _createPager: function () {
            var that = this,
        				id = 'ft' + (++$.guid),
        				options = that._o.pager,
                clm = 'pagination pagination-sm ',
                cl = 'pull-right';

            // Creating footer
            $(that._o.con).append('<div id="' + id + '"></div>');

            if(options.position){
              cl = options.position;
              if(cl === 'center'){
                cl = 'pull-center';
              }
              if(cl === 'left'){
                cl = 'pull-left';
              }
            }


            // Creating pager control
            pager = $('#' + id).pager({
                pageSize: options.pageSize,
                pagerSize: options.pagerSize,
                fl: true,
                cl: clm  + cl,
                callBack: function (index) {
                    that._pagerIdex = index;
                    that.bind();
                }
            });

            var p = $(pager[0]).data('pager');
            p.state(that._data.total, that._pagerIdex);
        },
        _createGrid: function () {

            var that = this,
        				len = that._data.gd.length,
        				i = 0,
        				d = that._data.gd,
        				bodyContent = that._gridContent,
        				cl;

            if(!that._built){

              bodyContent = $('<tbody/>')
              that._gridContent = bodyContent;
              cl = that._o.cl ? that._o.cl : 'table table-hover table-condensed';

              // Creating table frame
              $(that._o.con).empty().append('<table id="' + that._id + '" class="' + cl + '"></table>');
              // Creating header
              that._createHeader();

              // Add filter options
              that._addFilterOptions();

              // Add body content to the grid table
              $('#' + that._id).append(bodyContent);

              // Wire callbacks
              if (that._o.selectCallBack || that._o.updateCallBack || that._o.deleteCallBack) {
                  $('#' + that._id).click(function (e) {
                      var info = 'info',
                          lInfor = 'label-info',
                          lImportant = 'label-important',
                          el = $(e.target),
                          role = el.attr('role'),
                          row = el.closest($('tr[data-key]')),
                          key = row.attr('data-key');

                      if (that._o.enableSelect) {
                          $(that._o.con + ' tr').removeClass(info);
                          row.addClass(info);
                      }

                      if (role === that._roleUpdate) {
                          that._o.updateCallBack && that._o.updateCallBack(key, that._getRecord(key));
                      } else if (role === that._roleDelete) {
                          el.text('Confirm');
                          el.attr('role', that._roleConfirm);
                          el.removeClass(lInfor);
                          el.addClass(lImportant);

                      } else if (role === that._roleConfirm) {
                          that._o.deleteCallBack(key, that._getRecord(key));
                      } else {
                          that._o.selectCallBack && that._o.selectCallBack(key, that._getRecord(key));
                      }
                  });
              }


            }

            that._built = true;

            // Going through the data set
            bodyContent.empty();
            for (; i < len; i++) {
                bodyContent.append(that._createRow(d[i]));
            }

            // Finally creating the pager if specified
            // TODO: The pager needs to be re-rendered on each bind for now. :(
            // The pager object does not have internal refresh capability.
            // This will be addressed in the next version...
            that._o.pager && that._createPager();
        },
        bind: function () {
            var that = this,
			          ds;
            if (that._progress) return;

            that._progress = true;
            that._action(true);
            that._setState();

            if (that._o.proc) {
                that._o.proc(true);
            }
            ds = that._o.source;
            ds = new ds();
            ds.getData(that._st, function (data) {
                that._progress = false;
                if (that._o.proc) {
                    that._o.proc(false);
                }
                if (that._o.befoBind) {
                    if (!that._o.befoBind(data)) {
                        return;
                    }
                }
                that._data = data;
                that._action(false);
                data && that._createGrid();
            });
        }
    };
})();

// jQuery grid plug-in
$.fn.grid = function (option) {
    return this.each(function () {
        var
			$this = $(this);
        //data = $this.data('grid');

        //if (!data){
        option.con = $this[0].id;
        $this.data('grid', (data = new Grid(option)));
        //}
    })
}

$.fn.grid.Constructor = Grid;
