
var TestDataSource = function () { };

TestDataSource.prototype = {
    // callback signature = function(result){}
    // if multiselect them par is passed in form of
    // array [par1, par2,..., par(n)]
    getData: function (par, callback) {
    	var src = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
        var newList = [];
        for (var i = 0; i < src.length; i++) {
            newList.push({value: src[i] + '_val', text: src[i]});
        }
        var list = [
    		{value: 'one', text: 'One'},
    		{value: 'two', text: 'Two'}
    	]
    	callback(newList);
    }
};

$.dataSources = $.dataSources || {};
$.dataSources['ds-test'] = new TestDataSource();

/*
$.dataSources['ds-test'] = [
            {value: 'one', text: 'One'},
            {value: 'two', text: 'Two'}
        ];
*/

$.multiselect();


$('#getData').click(function(e){
    var c = $('#testId').data('multiselect');
    console.log(c.get());
    alert(c.get());
    e.preventDefault();
});


$('#setData').click(function(e){
    var c = $('#testId').data('multiselect');
    c.set(['Alabama_val','Alaska_val','Colorado_val','California_val','Arkansas_val']);
    e.preventDefault();
});


$('#submit').click(function(e){
    var c = $('#testId').data('multiselect');
    var f = $('form').serialize();
    alert(f);
    e.preventDefault();
});
