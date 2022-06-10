const submitbtn = document.getElementById('submit'),
  select1 = document.getElementById('exampleSelect1'),
  select2 = document.getElementById('exampleSelect2'),
  alertPlaceholder = document.getElementById('alertPlaceholder');

// Convenient function to POST any URL using the fetch API
async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  });
  return response.json();
}
const SubmitHandler = async (e) => {
  e.preventDefault();
  // Validation
  if (
    select1.value === null ||
    select2.value === null ||
    select1.value === select2.value ||
    select1.value == 'Select' ||
    select2.value == 'Select'
  ) {
    // Creates and destroys a bootstrap alert
    alert(
      'Invalid inputs. Make sure source and destination are selected and are different.',
      'danger'
    );
    setTimeout(() => {
      const alert = bootstrap.Alert.getOrCreateInstance('#myAlert');
      alert.close();
    }, '3000');
  } else {
    const values = {
      source: select1.value,
      dest: select2.value,
      user: 'user',
    };
    // Send to backend
    postData('http://localhost:3000', values)
      .then((data) => {
        // Returns Price and QR Code
        console.log(data);
      })
      .catch((error) => {
        console.log('Error: ' + error);
      });
  }
};
// Bootstrap function to add an alert with message and type of alert
const alert = (message, type) => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert" id="myAlert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>',
  ].join('');

  alertPlaceholder.append(wrapper);
};

submitbtn.addEventListener('click', SubmitHandler);
