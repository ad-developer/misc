ADUploader.attachTo(document.getElementById('uploader'),{add: true});

let btn = document.getElementById('btnData');
btn.addEventListener('click', (e)=>{
  let inst = ADUploader.getInstance(document.getElementById('uploader'));
  alert(inst.getFormData());
});
