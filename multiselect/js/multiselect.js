/* ========================================================================
 * multiselect.js v1.0.0
 * ========================================================================
 * Copyright 2017 A.D.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function($){

	// Control Description
	/*
		HTML MOCKUP:
			<div class="ms ms-expanded">
				<div class="ms-box">
					<div class="ms-choices" title="One, Two, More and more and more, next, next and next">
						One, Two, More and more and more, next, next and next, One, Two, More and more and more, next, next and next
					</div><b class="arrow-up"></b>
				</div>
				<div class="ms-list">
					<div class="ms-filter-block">
						<input name="" type="text"> <b class="glyphicon glyphicon glyphicon-search"></b>
					</div>
					<ul class="ms-choice-block">
						<li class="ms-choise"><input name="" type="checkbox"> <span class="ms-choice-text">Choice One</span></li>
						<li class="ms-choise"><input name="" type="checkbox"> <span class="ms-choice-text">Choice Two</span></li>
					</ul>
				</div>
			</div>


		CONTROL TAG
			<ad-multiselect id="id" non-select-text="Text appears on control when no selection" source="data-source" field-id="field-id" required="Message Text (not optional)"></ad-multiselect>
			field-id - is oprional attribute to save alternative id information

		DATA SOURCE OBJECT SIGNATURE:
			var DataSource = function () { };
	    	DataSource.prototype = {
		        // callback signature = function(result){}
		        // if multiselect them par is passed in form of
		        // array [par1, par2,..., par(n)]
		        getData: function (par, callback) { }
		    };

		DATA SOURCE CALLBACK RETURN OBJECT SIGNATURE:
			[{text:'text', value:'value'},...,n]

		DATA SOURCE MUST BE ATTACHED TO THE JQUERY OBJECT AS
			$.dataSources = {};
			$.dataSources[name] = new DataSource(); - instance of the data source
			object

		CONTROL USE:
			- put control tag(s) on the page with the datasource specified
			- each control MUST have and id
			- implement datasorce. refer to data source object signature
			- run $.multiselect() global method
			to retrive control object use the following notation
				var cobj = $('#id').data('multiselect');
			to get selected option out of control use cobj.get() method
				result will be in the followind form: [value,value,...,n]
			to set control to the selected option use cobj.set(par) method
				parameter will be in the following form: [value,value,...,n]
	*/

	////////////////////////////////////////////////////////////////////////////////

	var // helper methods
		div = function(cls){
			return $('<div />').addClass(cls);
		},

		//////////////////////////////////////
		// MULTICELECT CONSTRUCTOR DEFINITION
		//////////////////////////////////////
		Multiselect = function(el, option){
			this.el = el;
			this.option = option;
			this.init();
			// register instance of the control with the
			// the container
			this.con.data('multiselect',(data = this));
		};


	Multiselect.prototype = {
		init: function(){
			var attr = {};
			// load attributes
			$.each(this.el.attributes, function(){
				attr[this.name] = this.value;
			});
			this.attr = attr;
			this.choicesList = [];
			this.choicesRes = [];
			this.expanded = false;

			this.render();
		},
		render: function(){
			var $this = this,

					filterBlk;

			// main container
			$this.con = div('ms').attr('id',$this.attr['id']);
			if($this.attr['field-id']){
				$this.con.attr('field-id',$this.attr['field-id'])
			}

			// required capability:
			// The input box with 0 size
			// and 0 opacity is set to reflect required status of the
			// control. It is decorated with the
			// data-val=true
			// and data-val-required='Message Text'
			// attributes to be handled by jQuery validate plugin...
			if($this.attr['required']){
				$this.reqCtrl = $('<input/>')
					.attr({
						'data-val': true,
						'data-val-required': $this.attr['required'],
						'type': 'text',
						'name': 'dt-' + $this.attr['id']
					})
					.css({
						width: '0px',
						height: '0px',
						opacity: '0',
						position: 'absolute'
					});
				$this.con.append($this.reqCtrl);
			}

			// control box
			$this.controlBox = div('ms-box')
				.appendTo($this.con)
				.click(function () {
				    if ($this.expanded) {
				        $this.collapse();
				    } else {
				        $this.expand();
				    }
				});


			// choices section
			$this.choices = div('ms-choices')
			.text($this.attr['non-select-text'])
			.appendTo($this.controlBox);

			$this.choicesAr = $('<b />')
			.addClass('arrow-down')
			.appendTo($this.controlBox);

			// list container
			$this.lstCon = div('ms-list')
				.hide() // hide it when created first
				.appendTo($this.con);

			filterBlk = div('ms-filter-block')
			.appendTo($this.lstCon);

			$this.filterInp = $('<input />')
				.attr('type','text')
				.keyup(function(e){
					//String.fromCharCode(e.which);
					var txt = $(this).val().toLowerCase();
					$this.choicesBlk.find('li').each(function(){
						var el = $(this),
							text = el.attr('data-text').toLowerCase();

							if(text.search(txt) > -1){
								el.show();
							} else {
								el.hide();
							}
					});
				})
				.appendTo(filterBlk);
			filterBlk.append($('<b />').addClass('glyphicon glyphicon glyphicon-search'));

			$this.choicesBlk = $('<ul />')
			.addClass('ms-choice-block')
			.appendTo($this.lstCon);

			$this.renderList();

			$($this.el).replaceWith($this.con);
		},
		genDs: function(data){
			var ds = {
				getData: function(par, callback){
					return callback(data);
				}
			}
			return ds;
		},
		renderList: function(){
			var $this = this,
				ds = $.dataSources[$this.attr.source],
				li;
			if(ds){
				if($.isArray(ds)){
					ds = $this.genDs(ds);
				}
				ds.getData(null, function(list){
					$.each(list, function(){
						li = $('<li />')
							.append($('<input />').attr('type', 'checkbox').attr('value', this.value).attr('name', $this.attr['id']))
							.append($('<span />').addClass('ms-choice-text').text(this.text))
							.attr('data-value', this.value)
							.attr('data-text', this.text)
                            .attr('title', this.text)
							.click(function(e){
								var me = $(this);
								   chbx = me.children('input'),
								   target = $(e.target);

							   if(target.is('li') || target.is('span')){
								 if(chbx.is(':checked')){
									$this.removeFromChoices(me.attr('data-text'));
								 	chbx.prop('checked', false);
								 }else{
									$this.addToChoices(me.attr('data-text'), me.attr('data-value'));
									chbx.prop('checked', true);
								 }
							   } else {
							   	if(chbx.is(':checked')){
								 		$this.addToChoices(me.attr('data-text'), me.attr('data-value'));
								 	}	else {
									  $this.removeFromChoices(me.attr('data-text'), me.attr('data-value'));
								  }
							   }
							   $this.updateChoices();
							});
						$this.choicesBlk.append(li);
					})
				});
			}
		},
		addToChoices: function(text, value){
			this.choicesList.push(text);
			this.choicesRes.push(value);
		},
		removeFromChoices: function(text,value){
			var ind = this.choicesList.indexOf(text),
				indVal = this.choicesRes.indexOf(value);
			if(ind > -1){
				this.choicesList.splice(ind, 1);
			}
			if(indVal > -1){
				this.choicesRes.splice(indVal, 1);
			}
		},
		updateChoices: function(){
			var list,
			    ctrl = this.reqCtrl;
			if(this.choicesList.length > 0){
				 list = this.choicesList.join(', ');
			} else {
				 list = this.attr['non-select-text'];
			}
			this.choices.text(list).attr('title', list);

			if(this.choicesList.length > 0 && ctrl){
				ctrl.val('yes');
			} else if(ctrl){
				ctrl.val('');
			}
		},
		expand: function(){
			var width = this.con.width();
			this.lstCon.show();
            /* A.D. */
			this.con.addClass('ms-expanded');//.width(width);
			this.choicesAr
			.removeClass('arrow-down')
			.addClass('arrow-up');
			this.expanded = true;
		},
		collapse: function(){
			this.con
				.attr('style','')
				.removeClass('ms-expanded');

			this.choicesAr
			.removeClass('arrow-up')
			.addClass('arrow-down');
			this.lstCon.hide();
			this.expanded = false;
		},
		reset: function(){
			this.choicesList = [];
			this.choicesRes = [];
			this.choices.text(this.attr['non-select-text'])
			.attr('title', '');
			this.choicesBlk.find('input').prop('checked', false);
		},
		set: function(par){
			var $this = this;
			$this.reset();
			for (var i = 0, el, nd; el = par[i++];) {
				this.choicesBlk.find('li').each(function(){
					nd = $(this);
					if(nd.attr('data-value') === el){
						$this.addToChoices(nd.attr('data-text'), nd.attr('data-value'));
						nd.find('input').prop('checked', true);
						return false;
					}
				});
			}
			this.updateChoices();
		},
		get: function(){
			return this.choicesRes;
		}
	};

	function collapse(e){

	    var el = $(e.target).closest('.ms-expanded'),
			cntrSel;

		if(el.length){
			cntrSel = el.data('multiselect');
		}

		$('.ms-expanded').each(function(){
			var me = $(this),
				control = me.data('multiselect');

			if(!cntrSel || (cntrSel && cntrSel.attr['id'] !== control.attr['id'])){
				control.collapse();
			}
		});
	}

	// Register GLOBAL multiselect method
	$.multiselect = function(option){
		$('ad-multiselect').each(function(){
			new Multiselect(this, option);
		});
	}

	// Register GLOBAL events
	$(document)
		.on('click.multiselect', function(e){
			collapse.call(this,e);
		});

}(jQuery);
