var ad = ad || {};
ad.ADRte = (function(){

  /*
   <textarea someid>
   ad.ADRte.attachTo(el) - will replace textarea element with the control
  */
  var ADRte = function(root, opt) {
    var $this = this;
    $this.root_ = root;
    $this.opt_ = opt;
    $this.wrapper_ = null;
    $this.editor_ = null;

    $this.init();
  };

  ADRte.attachTo = function(root, opt) {
    var instance = new ADRte(root, opt);
    root.ad = root.ad || {};
    root.ad['RTE'] = instance;
    return instance;
  };

  ADRte.getInstance = function(root) {
      return root.ad && root.ad['RTE'] ? root.ad['RTE'] : null;
  };

  ADRte.prototype = {
    init: function(){
      var $this = this;

      // Init  wrapper
      var wp = document.createElement('div');
      wp.classList.add('ad-rte-wrapper');

      $this.wrapper_ = wp;

      // Init toolbars
      var topToolbar = $this.toolbarTopFxt_();
      $this.initToolbar_(topToolbar);

      var btnToolbar = $this.toolbarBottomFxt_();
      $this.initToolbar_(btnToolbar);

      // Init editor pad
      $this.initEditor_();

      // Replace the controls
      $this.root_.style.display = 'none';
      $this.root_.style.visibility = 'hidden';
      $this.insertAfter_(wp, $this.root_);
    },
    set: function(content) {
      this.editor_.innerHTML = content;
    },
    initEditor_: function() {
      var $this = this;
      var edt = document.createElement('div');
      edt.contentEditable = true;
      edt.classList.add('ad-rte-etitor');

      edt.addEventListener('keyup', function(){
        $this.changeHandler_();
      });

      this.editor_ = edt;
      this.wrapper_.appendChild(edt);

      this.set(this.root_.value);
    },
    insertAfter_: function(newNode, referenceNode) {
      referenceNode
        .parentNode
          .insertBefore(newNode, referenceNode.nextSibling);
    },
    initToolbar_: function(tbr) {
      tbr = ad.utils.createElement(tbr);
      var handlers = this.toolbarHandlers_();
      var actEls = tbr.querySelectorAll('[ad-action]');

      for (var i = 0, el; el = actEls[i]; i++) {
        var action = el.getAttribute('ad-action');
        var handler = handlers[action];
        if(handler){
          (function(handler){
            var evt = 'click';
            if(el.tagName === 'SELECT'){
                evt = 'change';
            }
            el.addEventListener(evt, function(){
              handler.call(this);
            });
          })(handler);
        }
      }
      this.wrapper_.appendChild(tbr);
    },
    toolbarHandlers_: function() {
      var $this = this;
      return {
        clean: function() {
          $this.editor_.focus();
          $this.editor_.innerHTML = '';
          $this.changeHandler_();
        },
        print: function() {
          var oPrntWin = window.open("","_blank","width=450,height=470,left=400,top=100,menubar=yes,toolbar=no,location=no,scrollbars=yes");
          oPrntWin.document.open();
          oPrntWin.document.write("<!doctype html><html><head><title>Print<\/title><\/head><body onload=\"print();\">" + $this.editor_.innerHTML + "<\/body><\/html>");
          oPrntWin.document.close();
        },
        undo: function(){
          $this.formatDoc_('undo');
            $this.changeHandler_();
        },
        redo: function(){
          $this.formatDoc_('redo');
          $this.changeHandler_();
        },
        remove_formatting: function(){
          $this.formatDoc_('removeFormat');
          $this.changeHandler_();
        },
        bold: function(){
          $this.formatDoc_('bold');
          $this.changeHandler_();
        },
        italic: function(){
          $this.formatDoc_('italic');
          $this.changeHandler_();
        },
        underline: function(){
          $this.formatDoc_('underline');
          $this.changeHandler_();
        },
        left_align: function(){
          $this.formatDoc_('justifyleft');
          $this.changeHandler_();
        },
        center_align: function(){
          $this.formatDoc_('justifycenter');
          $this.changeHandler_();
        },
        right_align: function(){
          $this.formatDoc_('justifyright');
          $this.changeHandler_();
        },
        numbered_list: function(){
          $this.formatDoc_('insertorderedlist');
          $this.changeHandler_();
        },
        dotted_list: function(){
          $this.formatDoc_('insertunorderedlist');
          $this.changeHandler_();
        },
        quote:function(){
          $this.formatDoc_('formatblock','blockquote');
          $this.changeHandler_();
        },
        add_indentation: function() {
          $this.formatDoc_('outdent');
          $this.changeHandler_();
        },
        delete_indentation: function() {
          $this.formatDoc_('indent');
          $this.changeHandler_();
        },
        hyperlink: function() {
          var sLnk = prompt('Write the URL here','http:\/\/');if(sLnk&&sLnk!=''&&sLnk!='http://'){
            $this.formatDoc_('createlink',sLnk);
            $this.changeHandler_();
          }
        },
        cut: function(){
          $this.formatDoc_('cut');
          $this.changeHandler_();
        },
        copy: function(){
          $this.formatDoc_('copy');
        },
        paste: function() {
          $this.formatDoc_('paste');
        },
        formatting: function(){
          $this.formatDoc_('formatblock',
          this[this.selectedIndex].value);
          this.selectedIndex=0;
          $this.changeHandler_();
        },
        font: function(){
          $this.formatDoc_('fontname',
          this[this.selectedIndex].value);
          this.selectedIndex=0;
          $this.changeHandler_();
        },
        font_size: function(){
          $this.formatDoc_('fontsize',
          this[this.selectedIndex].value);
          this.selectedIndex=0;
          $this.changeHandler_();
        },
        font_color: function(){
          $this.formatDoc_('forecolor',
          this[this.selectedIndex].value);
          this.selectedIndex=0;
        },
        background_color: function(){
          $this.formatDoc_('backcolor',
          this[this.selectedIndex].value);
          this.selectedIndex=0;
          $this.changeHandler_();
        }
      };
    },
    formatDoc_: function(cmd, value) {
      this.editor_.focus();
      document.execCommand(cmd, false, value);
      this.editor_.focus();
    },
    changeHandler_: function(){
      this.root_.value = this.editor_.innerHTML;
      ad.utils.emit(this.root_, 'change');
    },
    toolbarTopFxt_: function() {
      return '<div class=ad-rte-toolbar><button ad-action=clean class=ad-toolbar-button title=Clean><svg viewBox="0 0 24 24"><g><rect fill=none height=24 width=24 /></g><g><path d="M16,11h-1V3c0-1.1-0.9-2-2-2h-2C9.9,1,9,1.9,9,3v8H8c-2.76,0-5,2.24-5,5v7h18v-7C21,13.24,18.76,11,16,11z M19,21h-2v-3 c0-0.55-0.45-1-1-1s-1,0.45-1,1v3h-2v-3c0-0.55-0.45-1-1-1s-1,0.45-1,1v3H9v-3c0-0.55-0.45-1-1-1s-1,0.45-1,1v3H5v-5 c0-1.65,1.35-3,3-3h8c1.65,0,3,1.35,3,3V21z"/></g></svg></button> <button ad-action=print class=ad-toolbar-button title=Print><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"fill=none /><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg></button> <button ad-action=undo class=ad-toolbar-button title=Undo><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"fill=none /><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg></button> <button ad-action=redo class=ad-toolbar-button title=Redo><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"fill=none /><path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/></svg></button> <button ad-action=remove_formatting class=ad-toolbar-button title="Remove formatting"><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"fill=none /><path d="M3.27 5L2 6.27l6.97 6.97L6.5 19h3l1.57-3.66L16.73 21 18 19.73 3.55 5.27 3.27 5zM6 5v.18L8.82 8h2.4l-.72 1.68 2.1 2.1L14.21 8H20V5H6z"/></svg></button> <button ad-action=bold class=ad-toolbar-button title=Bold><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"fill=none /><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg></button> <button ad-action=italic class=ad-toolbar-button title=Italic><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"fill=none /><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg></button> <button ad-action=underline class=ad-toolbar-button title=Underline><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"fill=none /><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg></button> <button ad-action=left_align class=ad-toolbar-button title="Left align"><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"fill=none /><path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg></button> <button ad-action=center_align class=ad-toolbar-button title="Center align"><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"fill=none /><path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"/></svg></button> <button ad-action=right_align class=ad-toolbar-button title="Right align"><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"fill=none /><path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/></svg></button> <button ad-action=numbered_list class=ad-toolbar-button title="Numbered list"><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"fill=none /><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg></button> <button ad-action=dotted_list class=ad-toolbar-button title="Dotted list"><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z"fill=none /><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg></button> <button ad-action=quote class=ad-toolbar-button title=Quote><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"fill=none /><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg></button> <button ad-action=add_indentation class=ad-toolbar-button title="Add indentation"><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"fill=none /><path d="M11 17h10v-2H11v2zm-8-5l4 4V8l-4 4zm0 9h18v-2H3v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/></svg></button> <button ad-action=delete_indentation class=ad-toolbar-button title="Delete indentation"><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"fill=none /><path d="M3 21h18v-2H3v2zM3 8v8l4-4-4-4zm8 9h10v-2H11v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/></svg></button> <button ad-action=hyperlink class=ad-toolbar-button title=Hyperlink><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"fill=none /><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg></button> <button ad-action=cut class=ad-toolbar-button title=Cut><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"fill=none /><circle cx=6 cy=18 fill=none r=2 /><circle cx=12 cy=12 fill=none r=.5 /><circle cx=6 cy=6 fill=none r=2 /><path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z"/></svg></button> <button ad-action=copy class=ad-toolbar-button title=Copy><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"fill=none /><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button> <button ad-action=paste class=ad-toolbar-button title=Paste><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"fill=none /><path d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"/></svg></button></div>';
    },
    toolbarBottomFxt_: function() {
      return '<div class=ad-rte-toolbar><select ad-action=formatting class=ad-toolbar-control><option selected>- formatting -<option value=h1>Title 1 &lt;h1><option value=h2>Title 2 &lt;h2><option value=h3>Title 3 &lt;h3><option value=h4>Title 4 &lt;h4><option value=h5>Title 5 &lt;h5><option value=h6>Subtitle &lt;h6><option value=p>Paragraph &lt;p><option value=pre>Preformatted &lt;pre></select> <select ad-action=font class=ad-toolbar-control><option selected class=heading>- font -<option>Arial<option>Arial Black<option>Courier New<option>Times New Roman</select> <select ad-action=font_size class=ad-toolbar-control><option selected class=heading>- size -<option value=1>Very small<option value=2>A bit small<option value=3>Normal<option value=4>Medium-large<option value=5>Big<option value=6>Very big<option value=7>Maximum</select> <select ad-action=font_color class=ad-toolbar-control><option selected class=heading>- color -<option value=red>Red<option value=blue>Blue<option value=green>Green<option value=black>Black</select> <select ad-action=background_color class=ad-toolbar-control><option selected class=heading>- background -<option value=red>Red<option value=green>Green<option value=black>Black</select></div>';
    }
  };

  return ADRte;

})();
