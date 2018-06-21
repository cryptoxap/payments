window.onload = () => {
  let submit = document.getElementById('pay-submit');
  submit.onclick = validate;
  new AutoNumeric('#amount', {
    currencySymbol:'',
    decimalCharacter : ',',
    digitGroupSeparator : '.',
  });
}
 
function validate(event) {
  event.preventDefault()
  let currency = document.getElementById('currency').value
  let amount = (Number(AutoNumeric.getAutoNumericElement('#amount').getNumericString())
  .toLocaleString("es-ES", {
    style: 'currency',
    currency: currency
  }).replace( /[^0-9]/g,''))

  if(amount < 500){
    alert(`El importe no puede ser inferior a 5 ${currency}`)
  } else {
    if(!document.getElementById("check").checked){
      alert("Debe aceptar los términos y condiciones de uso")
    } else {
      grecaptcha.execute();
    }

  }
}

function sendPay(token) {
  let currency = document.getElementById('currency').value
  let amount = Number(AutoNumeric.getAutoNumericElement('#amount').getNumericString())
  .toLocaleString("es-ES", {
    style: 'currency',
    currency: currency
  })
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.overrideMimeType("application/json");
  xmlhttp.open("POST", "/payment", true);
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.responseType = 'json';
  xmlhttp.send(JSON.stringify({
    'g-recaptcha-response': token,
    'CustomerId': document.getElementById('customer-id').value,
    'Name': document.getElementById('customer-name').value,
    'LastName': document.getElementById('customer-lastname').value,
    'email': document.getElementById('email').value,
    'currency': currency,
    'amount': amount.replace( /[^0-9]/g,'')
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