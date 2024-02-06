const information = {
  username: "mohamed",
  password: "mohamed",
  email: "mohamed@gmail.com",
};
(async () => {
  try {
    const req = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(information),
    });
    const res = await req.json();
    console.log(res);
  } catch (error) {
    console.log(error);
  }
})();

// (async () => {
//   const req = await fetch("http://localhost:5000/Profile");
//   const res = await req.json();
//   console.log(res);
// })();


// (async () => {
//   const req = await fetch("http://localhost:5000/delete",{
//     method: "DELETE",
//   });
//   const res = await req.json();
//   console.log(res);
// })();









// const access_token = `EAADgSyhlZAoMBO5ZCqjov43ZC7uaUZBWpNNgZAuX0gQxhHi1wTPr3e7ufuGAHZAppZCZCfLM8rygNc4L6UglgeFhMwBLeOZCcOx5RPB3P1JG4ZAddWx5V7QIOQEOV0yqNjYAJrnYievMZCISEqULvJjZBFwxTpZAZBHsBu6yZC9Kg41LisPrpv7jvNbGcaQQdE5GALKdliVSohSTNKeYGeDjS8cdNqATBMZD`;
// const app_id = `246613404903043`
// const app_secret = `67bf1c5e87613336bb56a71c89375233`
// fetch(`https://graph.facebook.com/v17.0/oauth/access_token?  
// grant_type=fb_exchange_token&          
// client_id=${app_id}&
// client_secret=${app_secret}&
// fb_exchange_token=${access_token}`).then(i=>i.json()).then(i=>console.log(i))