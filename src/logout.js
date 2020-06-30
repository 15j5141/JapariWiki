import NCMBCloud from './scripts/class-cloud_ncmb.js';
const cloud = new NCMBCloud();
setTimeout(function() {
  cloud
    .signOut()
    .then(() => {
      location.href = 'login.html';
    })
    .catch(err => {
      location.href = 'login.html';
    });
}, 1000);
