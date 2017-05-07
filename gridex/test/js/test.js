var DataSet = class ClassName {
  constructor() {}

  getData(par, callback, caller){
    callback({
      total: 5,
      gd:[
        {id: 1, firstName: 'John', lastName: 'Smith', email: 'js@email.com'},
        {id: 2, firstName: 'Mark', lastName: 'Williams', email: 'mw@email.com'},
        {id: 3, firstName: 'Adam', lastName: 'Adams', email: 'aa@email.com'},
        {id: 4, firstName: 'George', lastName: 'Washington', email: 'gw@email.com'},
        {id: 5, firstName: 'Michael', lastName: 'Masters', email: 'mm@email.com'}
      ]
    });
  }
};ß

$('#g').grid({
  con: 'g',
  source: DataSet,
  key: 'id',
  fields:[
    {name: 'id', header: 'Id', sorted: true},
    {name: 'firstName', 'First Name', sorted: true, filter: true},
    {name: 'lastName', 'Last Name', sorted: true, filter: true},
    {name: 'email','Email Address', sorted: true}
  ],
  sort: {filedName: 'id'},
  pager:{},
  selectCallBack: function(key, record){
    console.log(key + ' -- ' record.firstName + ' -- ' + record.lastName);
  }
});
