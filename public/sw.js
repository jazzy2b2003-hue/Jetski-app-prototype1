self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('push',event=>{
  let data={title:'PWC Race Control',body:'Race-day update'};
  try{data={...data,...event.data.json()}}catch{}
  event.waitUntil(self.registration.showNotification(data.title,{body:data.body,icon:'/icon.svg',badge:'/icon.svg',tag:'race-control-alert',data:{url:'/'}}));
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(clients=>{
    if(clients.length){clients[0].navigate('/');return clients[0].focus();}
    return self.clients.openWindow('/');
  }));
});
