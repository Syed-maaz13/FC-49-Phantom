const submitbtn = document.getElementById('submit'),
  select1 = document.getElementById('exampleSelect1'),
  select2 = document.getElementById('exampleSelect2');

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
  if (
    select1.value === null ||
    select2.value === null ||
    select1.value === select2.value ||
    select1.value == 'Select' ||
    select2.value == 'Select'
  ) {
    console.log('Error');
  } else {
    const values = {
      source: select1.value,
      dest: select2.value,
      user: 'user',
    };
    postData('http://localhost:3000', values)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log('Error: ' + error);
      });
  }
};

submitbtn.addEventListener('click', SubmitHandler);
