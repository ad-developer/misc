document.querySelector('[ad-uploader-button]')
.addEventListener('click',function(e){
  document.querySelector('[ad-uploader-control]').click();
});

let send = function(){

};

document.querySelector('[ad-uploader-control]')
.addEventListener('change', function(e){
  let list = this.files;
  let formData = new FormData();
  [].forEach.call(list, function(f){
    formData.append();
  });
});
