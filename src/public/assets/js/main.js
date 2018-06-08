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
      console.log(xmlhttp.responseText)
      //redsys(JSON.parse(xmlhttp.responseText));
    }
  };
}