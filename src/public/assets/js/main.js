window.onload = () => {
  let submit = document.getElementById('pay-submit');
  submit.onclick = validate;
}
 
function validate(event) {
  event.preventDefault()
  grecaptcha.execute();
}

function sendPay(token) {
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.overrideMimeType("application/json");
  xmlhttp.open("POST", "/payment", true);
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.responseType = 'json';
  xmlhttp.send(JSON.stringify({
    'g-recaptcha-response': token,
    'userId': document.getElementById('customer-id').value,
    'userName': document.getElementById('customer-name').value,
    'userLastName': document.getElementById('customer-lastname').value,
    'email': document.getElementById('email').value,
    'amount': document.getElementById('amount').value,
    'currency': document.getElementById('currency').value
  }));
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState === xmlhttp.DONE) {
      switch(xmlhttp.status) {
        case 201:
          redsys(xmlhttp.response);
          break;
        case 400:
          alert(xmlhttp.response.message)
          break;
      } 
    }
  }
  grecaptcha.reset();
}

function redsys(result) {
  
  let form = document.createElement("form");
  let action = (result.env == 'production') ? "sis.redsys.es" : "sis-t.redsys.es:25443"
  form.setAttribute("action", `https://${action}/sis/realizarPago`) 
  form.setAttribute("method", "POST");
  form.setAttribute("style", "display: none");

  for(k in result) {
    if(k != 'env'){
      var field = document.createElement("input");
      field.setAttribute("name", k);
      field.setAttribute("value", result[k]);
      form.appendChild(field);
    }
  }
  document.body.appendChild(form);
  form.submit();
}