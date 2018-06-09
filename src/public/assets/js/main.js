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
  
  const DEBUG = true
  let form = document.createElement("form");
  let action = DEBUG ? "sis-t.redsys.es:25443" : "sis.redsys.es"
  form.setAttribute("action", `https://${action}/sis/realizarPago`) 
  form.setAttribute("method", "POST");
  form.setAttribute("style", "display: none");

  for(k in result) {
    var field = document.createElement("input");
    field.setAttribute("name", k);
    field.setAttribute("value", result[k]);
    form.appendChild(field);
  }

  document.body.appendChild(form);
  form.submit();
}