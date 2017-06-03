/**
  Copyright 2017 A.D.

  FILE:
    gridex.js

  DEPENDENCY:
    jquery.js
		pager.js
		gridex.css

  USAGE:
    1. set container
      <div id="con"></div> - container on the page.
    2. set datasource
      var DataSource = function(){};
      DataSource.prototype.getData = function(par, callback, caller){
        var returnObject = {}; //some data
        callback(returnObject);
      }
    3. init the grid
      var grid = jQuery('#con').grid({paremeters-object});
    4. bind grid to the data
      grid.bind();

  OPTIONS OBJECT:
    {
      key: 'id',	identity field (must be unique for each record)
      source: datasource-object
      con: 'con', host container id
      fields: [
                {
                  name:'Field_Name',
                  header:'Header Name',
                  [width]: 200,
                  [edit]: true, (will add button to the grid)
                  [sort]: true|false|{
                    [default]: true,
                    [direction]: asc|desc
                    },
                  [filter]: true|false | {
                      [server]: true|false
                  },
                  [custom]: function(record){
                    return 'text or html markup';
                  }
                },
          ...
      ]
      [pager]: {pageSize: 10, pagerSize: 2, [position]: 'center| left' }
        by default pager position is right and does not need to be set
      [sort]: {field: 'filedName', [dirction]: 'asc'|'desc'} name of the field that will be sorted on the first load of the grid
      [befoBind]: function(data){ return true|false} triggered before data bound... return true if you want to abort the binding process
      [selectCallBack]: function(key, record){}, triggered on row selected... return key and selected row record
      [updateCallBack]: function(key, record){}  triggered on row updated... return updated row record
      [proc]: function(startStop) {} indicate on data binding start/stop... can be used to start/stop progress indicator
      [filterEmptyVal]: sets filter empty value, by default it is an empty string with one space character ' '
      [filterResizable]: true|false  enable filter option list to be resizable, a grip on the right bottom conrner will be added.
    }
  PUBLIC INSTANCE METHODS:
    bind([caller], [pager])
      method binds data to the grid
      parameters:
        'caller' (optional) can be any object or variable to pass allong to the
          the getData(), datasource's method (see datasource object definition)
          used values:
            1. 'filter' - is sent when filtering action occured
            2. 'sort'   - is sent when filtering sorting occured
            3. 'pager'  - is sent when paging action occured
        'pager' (optional) - object to dynamically reset the pager parameters
          internally calls setPager(pager) method... see below
          { [pageSize]: 10, [pagerIndex]: 2}
          all pager parameters are optional

    setPager(pager)
      dynamically reset pager parameters and behaviour
      parameters:
        'pager' - pager object
        {[pageSize]: 10, [pagerIndex]: 2}
        all pager parameters are optional

    DATASOURCE OBJECT:
      {
        getData: function(par, callback, caller){
          ...
          var returnObject = {};
          callback(returnObject);
        }
      }
      'par' will be passed as an object and will include the following fields:
        if paging is engaged:
          page: - int (page index)
          pageSize: - int (page size)

        if sorting is engaged:
          sortField -  string (field name)
          sortDirection -  string (sorting direction asc|desc)

        if filtering is engaged
          filter: { field-name:['item-one',...,n],...,n:[...]}

      'callback' callback method

      callback's 'returnObject' must be in the following form:
        {
          gd:[{Name: 'Alex', Address:'Some Address'},..., {...}],
          total: 200,
          [ft]:[field:['item-one','item-two',...,n],..., n:[...]]
        }
      'ft' is optional field but must be supplied if filtering set as 'server' (refer to filter option)
      'caller' - refer to bind method

 */

+function () {
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
        _action: function (show) { },
        _roleUpdate: 'edit',
        _roleDelete: 'delete',
        _roleConfirm: 'confirm',
        _data: [],
        _pagerIndex: 1,
        _st: '',
        _built: false,
        _gridContent: null,
        _filterOpt: {},
        _selFiltOpt: {},
        _filterEmptyVal: ' ',
        _pager: null,
        _getRecord: function (key) {

            if (!isNaN(key)) {
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
                that._st.page = that._pagerIndex;
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
            // comming from the protected _selFiltOpt variable
            that._st.filter = that._selFiltOpt;

        },

        // filter options block of methods
        _groupBy: function (column) {
            var flags = [],
                output = [],
                el,
                i = 0,
                array = this._data.gd;
            if (array) {
                for (; el = array[i++];) {
                    el = el[column];
                    if (flags[el]) {
                        continue;
                    }
                    flags[el] = true;
                    output.push(el);
                }
            }
            return output;
        },
        _selectFilterOption: function (el, e, all) {
            //TODO: this method needs to be optimized
            var me = $(el),
                val = me.attr('ad-value'),
                fieldName = me.parent().attr('id').split('_')[2],
                field = this._filterOpt[fieldName],
                chbx = me.children('input'),
                target = $(e.target),
                ul = me.closest('ul').find('input');

            if (target.is('li') || target.is('span')) {
                if (chbx.is(':checked')) {
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
                if (chbx.is(':checked')) {
                    field.s--;
                    all ? this._addRemSelOpt(fieldName, field.l) : this._addRemSelOpt(fieldName, val);
                    all && ul.prop('checked', false) && (field.s = 0);
                } else {
                    field.s++;
                    all ? this._addRemSelOpt(fieldName, field.l, true) : this._addRemSelOpt(fieldName, val, true);
                    all && ul.prop('checked', true) && (field.s = field.t);
                }
            }
            if (!all) {
                all = true;
                if (field.s < field.t) {
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
            if (field.s > 0) {
                ul.addClass('gex-filter-btn-applied');
            } else {
                ul.removeClass('gex-filter-btn-applied');
            }

            this.bind('filter');
        },
        _addRemSelOpt: function (fieldName, par, add) {
            var index = 0,
                el;
            if (Array.isArray(par)) {
                for (; index < par.length; index++) {
                    el = par[index];
                    this._addRemSelOpt(fieldName, el, add);
                }
            } else {

                el = this._selFiltOpt[fieldName];
                if (el) {
                    index = el.indexOf(par);
                } else {
                    el = this._selFiltOpt[fieldName] = [];
                    index = -1;
                }

                if (add) {
                    if (index <= -1) {
                        el.push(par);
                    }
                } else {
                    if (index > -1) {
                        el.splice(index, 1);
                    }
                }
            }
        },
        _addFilterOptions: function () {
            var $this = this,
                e,
                val,
                list,
                con,
                i = 0,
                j;
            for (; e = this._o.fields[i]; i++) {
                if (e.filter) {
                    if (e.filter.server) {
                        list = this._data.ft[e.name];
                    } else {
                        list = this._groupBy(e.name);
                    }
                    if (list && list.length) {
                        // set initial state of filter options
                        $this._filterOpt[e.name] = {};
                        $this._filterOpt[e.name].t = list.length;
                        $this._filterOpt[e.name].s = 0;
                        $this._filterOpt[e.name].l = list;
                        con = $('#col_ch_' + e.name);
                        con
                        .empty()
                        .append(
                          $('<li/>')
                            .attr('dt-all', true)
                            .append($('<input/>').attr('type', 'checkbox'))
                            .append($('<span/>').text('All'))
                            .on('click', function (e) {
                                $this._selectFilterOption(this, event, true);
                            })
                        );
                        j = 0;
                        for (; j < list.length; j++) {
                            // handle null or empty strings
                            val = e = list[j];
                            if (e === null || e === '') {
                                // TODO: empty choice value needs to be configurable
                                // in the
                                val = $this._o.filterEmptyVal ? $this._o.filterEmptyVal : $this._filterEmptyVal;
                                list[j] = val;
                                e = '[Empty]';
                            }
                            con
                            .append(
                              $('<li/>')
                                .attr('ad-value', val)
                                .attr('title', e)
                                .append($('<input/>').attr('type', 'checkbox'))
                                .append($('<span/>').text(e))
                                .on('click', function () {
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
                br = '\n',
                tooltip;

            // Remove all carets
            $(this._o.con)
              .find('.caret')
              .remove();
            $(this._o.con)
            .find('.sorted')
            .removeClass('sorted');

            // Reset all tooltips
            $(this._o.con)
                .find('.gex-header-label').each(function(){
                  tooltip = $(this).attr('title');
                  tooltip = tooltip.replace(br + srtD, '').replace(br + srtA, '');
                  $(this).attr('title', tooltip);
                });

            // Get original tooltip
            tooltip = $(el).parent().attr('title');

            // Add caret to selected
            // header
            newEl.addClass('caret');
            if (that._sort.field === field) {
                if (that._sort.dir === 'asc') {
                    that._sort.dir = 'desc';
                    newEl.addClass('up');
                    tooltip += (br + srtD);
                } else {
                    that._sort.dir = 'asc';
                    tooltip += (br + srtA);
                }
            } else {
                that._sort.dir = 'asc';
                tooltip += (br + srtA);
            }


            // Add carret to the link
            // and update tooltip

            $(el).parent().attr('title', tooltip);
            $(el)
            .append(newEl)
            .addClass('sorted');

            // Set new state
            that._sort.field = field;
        },
        _isOffScreen: function (el) {
            var rect = el[0].getBoundingClientRect();
            return rect.right > window.innerWidth;
        },
        _initGrip: function(e){
          $(e.target).on('mouseup',function(ev){
            ev = ev.originalEvent;

          })
        },
        _doResize: function(e){
          var ev = e.originalEvent,
              $this = this,
              el = $this._resizableList;
          var w = ($this.startW + ev.clientX - $this.startX) + 'px';
          var h = ($this.startH + ev.clientY - $this.startY) + 'px';
          console.log(w + ' width');
          console.log(h + ' height');

          el.css('width', ($this.startW + ev.clientX - $this.startX) + 'px');
          el.css('height', ($this.startH + ev.clientY - $this.startY) + 'px');
        },
        _stopResize: function(e){
          console.log('stop resize');
          var el = $(e.target);
          el.off('mousemove')
            .off('mouseup');
        },
        _createGrip: function(){
          var $this = this,
              con = $('<div/>'),
              div = '<div/>',
              rowCl = 'grip-row',
              cellCl = 'grip-cell',
              noCellCl = 'no-cell';

          $this.startX = 0;
          $this.startY = 0;
          $this.startW = 0;
          $this.startH = 200;

          con.addClass('gex-grip');
          con
          .append(
            $(div).addClass(rowCl)
            .append(
              $(div).addClass(noCellCl)
            )
            .append(
              $(div).addClass(noCellCl)
            )
            .append(
              $(div).addClass(cellCl)
            )
          )
          .append(
            $(div).addClass(rowCl)
            .append(
              $(div).addClass(noCellCl)
            )
            .append(
              $(div).addClass(cellCl)
            )
            .append(
              $(div).addClass(cellCl)
            )
          )
          .append(
            $(div).addClass(rowCl)
            .append(
              $(div).addClass(cellCl)
            )
            .append(
              $(div).addClass(cellCl)
            )
            .append(
              $(div).addClass(cellCl)
            )
          )
          .on('mousedown', function(e){
            var ev = e.originalEvent,
                grip = $(this),
                el = grip.parent();

            $this._resizableList = el;

            $this.startX = ev.clientX;
            $this.startY = ev.clientY;
            $this.startW = parseInt(el.css('width'), 10);
            $this.startH = parseInt(el.css('height'), 10);

            grip.on('mousemove', function(e){
              e.preventDefault();
              $this._doResize.call($this, e);
            });
            grip.on('mouseup',function(e){
                $this._stopResize.call($this, e);
              });
          });
          return con;
        },
        _createHeaderCell: function (option, btn, sort, filter) {
            var that = this,
                th = $('<th/>').addClass('gex-header'),
                hCon = $('<div/>').addClass('gex-header-container'),
                hLabel = $('<div/>').addClass('gex-header-label'),
                hfMask = $('<div/>').addClass('gex-filter-mask'),
                filterContent = null,
                br = '\n',
                tooltip,
                link,
                ar;
            th.append(hCon.append(hLabel).append(hfMask));

            if (option.width) {
                th.width(option.width);
            }
            tooltip = option.header;
            if (sort) {
                +function (me, field, header) {

                    link = $('<a/>')
                    .click(function () {
                        that._resetDirection.call(that, me, field, this);
                        that.bind('sort');
                    })
                    .text(header);
                }(this, option.name, option.header);

                if (option.name === that._sort.field) {
                    ar = $('<span />').addClass('caret');
                    if (that._sort.dir && that._sort.dir === 'desc') {
                        ar.addClass('up');
                    }
                    link
                    .append(ar)
                    .addClass('sorted');

                    tooltip += br + '(Sorted descending)'
                }
                hLabel.append(link);

            } else if (!btn) {
                hLabel.text(option.header);
            }

            hLabel.attr('title', tooltip);

            if(filter){
              hfMask.append(
                $('<span/>')
                  .addClass('glyphicon glyphicon-filter  gex-filter-btn pull-right')
                  .attr('ad-ref-list', 'col_ch_' + option.name)
                  .on('click', function(){
                    var me = $(this),
                        parent = me
                        .parent()
                        .parent()
                        .parent().addClass('gex-header-selected');
                        // use ar as a width for the filter list
                        ar = parent.outerWidth() - 3;
                        if (ar < 200) {
                            ar = 200;
                        }
                        // TODO: Detect if the drop down is offscreen
                        // on the right or on the bottom edge of the
                        // view port
                        // Here is the possible solution:
                        // http://stackoverflow.com/questions/8897289/how-to-check-if-an-element-is-off-screen
                        ar = $('#' + me.attr('ad-ref-list'))
                        .parent()
                        .width(ar)
                        .show();
                        if (that._isOffScreen(ar)) {
                            ar.addClass('off-right-edge');
                        }
                  })
              );
              filterContent = $('<div/>')
                .hide()
                .addClass('gex-list')
                .append(
                  $('<ul>')
                    .attr('id', 'col_ch_' + option.name)
                    .addClass('gex-choice-block gex-list-block')
                )
                .on('mouseleave',function(){
                    //th.removeClass('gex-header-selected');
                    //$(this).hide();
                });

              // Add grip
              if(that._o.filterResizable){
                filterContent.append(that._createGrip());
              }

              th.append(filterContent)
              .on('mouseleave', function(){
                $(this)
                //.removeClass('gex-header-selected')
                //.children('.gex-list').hide();
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

            for (; i < this._o.fields.length; i++) {
                e = this._o.fields[i];
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

            if (options.position) {
                cl = options.position;
                if (cl === 'center') {
                    cl = 'pull-center';
                }
                if (cl === 'left') {
                    cl = 'pull-left';
                }
            }

            if (!that._built) {
                // Creating footer
                $(that._o.con).append('<div id="' + id + '"></div>');

                // Creating pager control
                that._pager = $('#' + id).pager({
                    pageSize: options.pageSize,
                    pagerSize: options.pagerSize,
                    fl: true,
                    cl: clm + cl,
                    callBack: function (index) {
                        that._pagerIndex = index;
                        that.bind('pager');
                    }
                });
                that._pager = $(that._pager[0]).data('pager');
            }
            that._pager.state(that._data.total, that._pagerIndex, options.pageSize);
        },
        _createGrid: function () {

            var that = this,
        				len = that._data.gd.length,
        				i = 0,
        				d = that._data.gd,
        				bodyContent = that._gridContent,
        				cl;

            if (!that._built) {

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

                      if(key){
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
                      }
                    });
                }
            }

            // Going through the data set
            bodyContent.empty();
            for (; i < len; i++) {
                bodyContent.append(that._createRow(d[i]));
            }

            // Creating the pager if specified
            that._o.pager && that._createPager();

            // Finally setting state of the control
            // as built :)
            that._built = true;
        },
        setPager: function(pager){
          if(pager){
            if(pager.pageSize){
              this._o.pager.pageSize = pager.pageSize;
            }
            if(pager.pagerIndex){
              this._pagerIndex = pager.pagerIndex;
            }
          }
        },
        bind: function (caller, pager) {
            var that = this,
			          ds;
            if (that._progress) return;
            that.setPager(pager);

            that._progress = true;
            that._action(true);
            that._setState();

            if (that._o.proc) {
                that._o.proc(true);
            }
            ds = that._o.source;
            ds = new ds();
            ds.getData.call(that, that._st, function (data) {
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
            }, caller);
        }
    };
}();

// jQuery grid plug-in
$.fn.grid = function (option) {
    return this.each(function () {
        var $this = $(this);
        option.con = $this[0].id;
        $this.data('grid', (data = new Grid(option)));
    })
}

$.fn.grid.Constructor = Grid;
