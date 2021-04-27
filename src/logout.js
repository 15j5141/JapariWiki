import { CloudNCMB } from './scripts';
const cloud = new CloudNCMB();
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
