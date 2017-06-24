// checkbox.js
let cb = document.querySelectorAll('[ad-checkbox]');
for (let i = 0; i < cb.length; i++) {
  cb[i].addEventListener('click', function(e){
    this.classList.add('hide');
    let el = this.parentElement.querySelector('[ad-hidden]');
    el.classList.remove('hide');
    el.removeAttribute('ad-hidden');
    this.setAttribute('ad-hidden', true);
  });
};
