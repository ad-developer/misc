var DataSource = window.DataSource = function () { };
DataSource.prototype = {
  getData: function (par, callback, caller) {
    if(caller && caller === 'filter'){
      //alert('reset');
      this.setPager({pagerIndex: 1});
      par.page = 1;
    }
    var res = {
      ft: {
        firstName: [null, 'John','Patric', 'Michael','Nick','Ron','Rob','Warren','Charlie'],
        title: [null, 'Programmer','Accountant','Assosiate','Driver'],
        status: [null, 'Closed','New', 'In Progress', 'Suspended']
      },
      gd:[
        {id: 1, lastName:'Smith', firstName:'John', title: 'Programmer', status: 'Closed', statusColor: 'green'},
        {id: 2, lastName:'Adams', firstName:'Patric', title: 'Programmer', status: 'In Prgress', statusColor: 'yeallow'},
        {id: 6, lastName:'Clark', firstName:'John', title: 'Programmer', status: 'New', statusColor: 'red'},
        {id: 18, lastName:'Jefferson', firstName:'Michael', title: 'Accountant', status: 'Suspended', statusColor: 'blue'},
        {id: 167, lastName:'Masters', firstName:'Nick', title: 'Assosiate', status: 'Closed', statusColor: 'green'},
      ],
      total: 5
    };
    callback(res);
  }
};

function statusField(record){
var r = $('<div/>'),
    c;
  if(record.statusColor === 'red'){
    c= '#ff0000';
  }
  if(record.statusColor === 'blue'){
    c= '#0000ff';
  }
  if(record.statusColor === 'green'){
    c= '#008000';
  }
  if(record.statusColor === 'yeallow'){
    c= '#ffff00';
  }

  r
    .css('background-color',c)
    .css('margin','auto')
    .attr('title', record.status)
    .width(20)
    .height(20);

  return $('<div/>').append(r).html();
};

var grid = $('#g').grid({
    source: DataSource,
    fields: [
        //{ name: 'id', header: 'ID',  width: 30, sort: true },
        { name: "lastName", header: 'Last Name Really Long Long Last Name is Here', width:120, filter: true, sort: true },
        { name: "firstName", header: 'First Name',   filter: {server: true} },
        { name: "title", header: 'Title',  sort: true },
        { name: "status", header: 'Status', custom:statusField,  width: 90, sort: true, filter: true },
    ],
    sort: { field: 'lastName', direction: 'desc' },
    key: 'id',
    filterResizable: true,
    selectCallBack: function(key, record){
      alert(key);
    },
    pager: {
        pageSize: 4,
        pagerSize: 2,
        position: 'center'
    }
});

grid = $(grid[0]).data('grid');

grid.bind();


var groupBy = function(xs, key) {
return xs.reduce(function(rv, x) {
  (rv[x[key]] = rv[x[key]] || []).push(x);
  return rv;
}, {});
};
console.log(groupBy(['one', 'two', 'three'], 'length'));
// => {3: ["one", "two"], 5: ["three"]}


$('#rec').change(function(){
var val = $(this).val();
grid.bind(null, {pageSize: parseInt(val), pagerIndex: 1});
});
