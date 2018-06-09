document.getElementById('pay-submit').addEventListener('click', sendPay);

function sendPay() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.overrideMimeType("application/json");
  xmlhttp.open("POST", "/payment", true);
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.send(JSON.stringify({
    userId: document.getElementById('customer-id').value,
    email: document.getElementById('email').value,
    amount: document.getElementById('amount').value
  }));
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == 4 && xmlhttp.status == "201") {
      redsys(JSON.parse(xmlhttp.responseText));
    }
  };
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