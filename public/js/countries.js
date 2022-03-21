   
   
   
   
   document.addEventListener('DOMContentLoaded', () => {

      const selecteer_land = document.querySelector('#landen');

      fetch(`https://restcountries.com/v3.1/all`).then(res => {
      return res.json();
      }).then(data => {
         let output = "";
         data.forEach(country => {
            output += `<option value="${country.name.common}">${country.flag} ${country.name.common}</option>`;
         })

         selecteer_land.innerHTML = output;
      }).catch(err => {
         console.log(err);
      })
   });